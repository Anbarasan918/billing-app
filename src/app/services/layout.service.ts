import {Injectable} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators'; 
import {YtResponse} from '../models/YtResponse';
import {apiUrl} from '../../environments/environment';
import {PageCount} from '../models/YtResponse'

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private productUrl = `${apiUrl}/layoutSchema`;
    private categoryUrl = `${apiUrl}/category`;

    constructor(private http: HttpClient) {
    }

    getAllInPage(page: number, size: number,filter:any): Observable<YtResponse> {
        const url = `${this.productUrl}/getLayouts`;   
        // let params = new HttpParams().set('filter', '{"name":"taf"}').set("sortd",'["lastUpdatedOn","DESC"]').set("sdfsd","sdfsd");  
        filter.isFreeSearch =true;
        filter = JSON.stringify(filter); 
        let range:any = [page,PageCount.count];
        range= JSON.stringify(range); 
        let params = new HttpParams().set("range",range).set('filter', filter);
        return this.http.get<YtResponse>(url,{params:params });
    }

     

    getLayout(id: String): Observable<YtResponse> {
        const url = `${this.productUrl}/getLayout/${id}`;
        return this.http.get<YtResponse>(url).pipe(
            catchError(_ => {
                console.log("Get Detail Failed");
                return of(new YtResponse());
            })
        );
    }

    update(any: any): Observable<any> {
        const url = `${this.productUrl}/createLayout`;
        return this.http.post<any>(url, any);
    }

    create(any: any): Observable<any> {
        const url = `${this.productUrl}/createLayout`;
        return this.http.post<any>(url, any);
    }


 /**   delelte(any: any): Observable<any> {
        const url = `${this.productUrl}/${any.productId}/delete`;
        return this.http.delete(url);
    } */

 
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
