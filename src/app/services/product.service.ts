import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductInfo } from '../models/productInfo';
import { YtResponse } from '../models/YtResponse';
import { apiUrl } from '../../environments/environment';
import { PageCount } from '../models/YtResponse'

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productUrl = `${apiUrl}/product/productinventory`;
    private categoryUrl = `${apiUrl}/category`;
    private invoiceUrl = `${apiUrl}/invoice`;

    constructor(private http: HttpClient) {
    }

    getAllInPage(page: number, size: number, filter: any): Observable<YtResponse> {
        const url = `${this.productUrl}`;
        // let params = new HttpParams().set('filter', '{"name":"taf"}').set("sortd",'["lastUpdatedOn","DESC"]').set("sdfsd","sdfsd");  
        filter.isFreeSearch = true;
        filter = JSON.stringify(filter);
        let range: any = [page, PageCount.count];
        range = JSON.stringify(range);
        let params = new HttpParams().set("range", range).set('filter', filter);
        return this.http.get<YtResponse>(url, { params: params });
    }

    getJobData(): Observable<any> {
        const url = `https://jsonplaceholder.typicode.com/todos/1`;
        return this.http.get(url).pipe(
            // tap(data => console.log(data))
        );
    }

    saveInvoices(productInfo: any): Observable<any> {
        const url = `${this.invoiceUrl}/invoiceBulk/new`;
        return this.http.post<any>(url, productInfo);
    }

    getSyncedInvoices(page: number, size: number, filter: any): Observable<any> {
        const url = `${this.invoiceUrl}/invoiceinventory`;
    //    filter.isFreeSearch = true;
        filter.roleCode = "ROLE_ADMIN";
        filter = JSON.stringify(filter);

        let range: any = [page, size];
        range = JSON.stringify(range);
        // .set("sort",'["createdOn","DESC"]')
        let params = new HttpParams().set("range", range).set('filter', filter);
        return this.http.get<any>(url, { params: params });
    }

    generateReports(page: number, size: number, filter: any): Observable<any> {
        const url = `${this.invoiceUrl}/generateReport`;
        filter.roleCode = "ROLE_ADMIN";
        filter = JSON.stringify(filter);
        let params = new HttpParams().set('filter', filter);
        return this.http.get<any>(url, { params: params });
    }

    getCategoryInPage(categoryType: number, page: number, size: number): Observable<any> {
        const url = `${this.categoryUrl}/${categoryType}?page=${page}&size=${size}`;
        return this.http.get(url).pipe(
            // tap(data => console.log(data))
        );
    }

    getDetail(id: String): Observable<YtResponse> {
        const url = `${this.productUrl}/${id}`;
        return this.http.get<YtResponse>(url).pipe(
            catchError(_ => {
                console.log("Get Detail Failed");
                return of(new YtResponse());
            })
        );
    }

    update(productInfo: ProductInfo): Observable<ProductInfo> {
        const url = `${this.productUrl}/new`;
        return this.http.post<ProductInfo>(url, productInfo);
    }

    create(productInfo: ProductInfo): Observable<ProductInfo> {
        const url = `${this.productUrl}/new`;
        return this.http.post<ProductInfo>(url, productInfo);
    }


    /**   delelte(productInfo: ProductInfo): Observable<any> {
           const url = `${this.productUrl}/${productInfo.productId}/delete`;
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
