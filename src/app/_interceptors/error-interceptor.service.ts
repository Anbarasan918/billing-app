import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {SpinnerService} from "../services/spinner.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private userService: UserService,
                private router: Router,
                private spinnerService:SpinnerService) {
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      this.spinnerService.toggleSpinner(false);

      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.userService.logout();
          this.router.navigate(['/login']);
      }

        const error = err.error || err.statusText;
      return throwError(error);
    }))
  }
}
