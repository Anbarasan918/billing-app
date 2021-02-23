import {Injectable} from '@angular/core';
import {UserService} from "../services/user.service";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
}) 
export class JwtInterceptor implements HttpInterceptor {


    constructor(private userService: UserService, private cookieService: CookieService
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(this.cookieService.get('currentUser')!=""){
            let userSession=JSON.parse(this.cookieService.get('currentUser')); 
            let userToken;
            let userTokenType;
            if(userSession){
                 userToken = userSession.token;
                 userTokenType = userSession.type;
            }


            const currentUser = this.userService.currentUserValue;
            if (userToken) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `${userTokenType} ${userToken}`
                      //  'Content-Type': 'application/json'
                    }
                });
            }

        } 
        
        return next.handle(request);
    }
}
