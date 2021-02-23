import {Injectable} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import {apiUrl} from '../../environments/environment';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {JwtResponse} from '../response/JwtResponse';
import {YtResponse} from '../models/YtResponse';
import {CookieService} from 'ngx-cookie-service';
import {User} from "../models/User";
import {PageCount} from '../models/YtResponse';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private currentUserSubject: BehaviorSubject<JwtResponse>;
    public currentUser: Observable<JwtResponse>;
    public nameTerms = new Subject<string>();
    public name$ = this.nameTerms.asObservable();
    constructor(private http: HttpClient,
                private cookieService: CookieService) {
					
			if(cookieService.get('currentUser')!="" && cookieService.get('currentUser')!=null){

                const memo = cookieService.get('currentUser'); 
		
                this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(memo));
                this.currentUser = this.currentUserSubject.asObservable();
         
                let userSession=JSON.parse(this.cookieService.get('currentUser')); 
                let userToken;
                let userTokenType;
        
                if(userSession){  
                    this.nameTerms.next(userSession.name);
                    this.currentUserSubject.next(userSession);
               }
            }else{
                this.currentUserSubject = new BehaviorSubject<JwtResponse>(null);
                this.currentUser = this.currentUserSubject.asObservable();
            }
                //cookieService.set('currentUser',"{}");
					
        
 
        //cookieService.set('currentUser', memo);
    }

    get currentUserValue() {
        return this.currentUserSubject.value;
    }


    login(loginForm): Observable<JwtResponse> {
        const url = `${apiUrl}/users/login`;
        return this.http.post<JwtResponse>(url, loginForm).pipe(
            tap(user => {
                if (user && user.token) {
                    this.cookieService.set('currentUser', JSON.stringify(user));
                    if (loginForm.remembered) {
                        //localStorage.setItem('currentUser', JSON.stringify(user));
                    } 
                    this.nameTerms.next(user.name);
                    this.currentUserSubject.next(user);
                    return user;
                }
            })
            // ,
            // catchError(this.handleError('Login Failed', null))
        );
    }

    logout() {
        this.currentUserSubject.next(null);
        //localStorage.removeItem('currentUser');
        this.cookieService.set('currentUser',null);
    }

    signUp(user: User): Observable<YtResponse> {
        const url = `${apiUrl}/users/register`;
        return this.http.post<YtResponse>(url, user);
    }

    requestFPOtp(user: any): Observable<YtResponse> {
        let params = new HttpParams().set('email', user.email); 
        const url = `${apiUrl}/users/request/resetPassword`;
        return this.http.post<YtResponse>(url, null,{params:params});
    }

    changePassword(user: any): Observable<YtResponse> {
        const url = `${apiUrl}/users/request/savePassword`;
        return this.http.post<YtResponse>(url, user);
    }

    update(user: User): Observable<User> {
        const url = `${apiUrl}/profile`;
        return this.http.put<User>(url, user);    }

    get(email: string): Observable<User> {
        const url = `${apiUrl}/profile/${email}`;
        return this.http.get<User>(url);
    }

    getLoggedInUser(): Observable<YtResponse> {
        const url = `${apiUrl}/users/user/getLoggedInUser`;
        return this.http.get<YtResponse>(url);
    }

    updateProfile(user: User): Observable<YtResponse> {
        const url = `${apiUrl}/users/user/updateProfile`;
        return this.http.post<YtResponse>(url, user);
    }

    getAllInPage(page: number, size: number,filter:any): Observable<YtResponse> {
        const url = `${apiUrl}/users/admin/getUsers`;   
        // let params = new HttpParams().set('filter', '{"name":"taf"}').set("sortd",'["lastUpdatedOn","DESC"]').set("sdfsd","sdfsd");  

        filter.isFreeSearch =true;
        filter.roleCode="ROLE_ADMIN";
        filter = JSON.stringify(filter); 

        let range:any = [page,PageCount.count];
        range= JSON.stringify(range);
        let params = new HttpParams().set("range",range).set('filter', filter); 
        return this.http.get<YtResponse>(url,{params:params });
    }

    getAdminUser(uuid: string): Observable<YtResponse> {
        const url = `${apiUrl}/users/admin/user/${uuid}`;
        return this.http.get<YtResponse>(url);
    }

    createAdminUser(user: User): Observable<YtResponse> {
        const url = `${apiUrl}/users/admin/register`;
        return this.http.post<YtResponse>(url, user);
    }
 
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.log(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
