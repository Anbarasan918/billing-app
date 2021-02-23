import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent ,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {apiUrl} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = `${apiUrl}`;

  constructor(private http: HttpClient) { }

  upload(file: File,productId: string): Observable<HttpEvent<any>> {  
    const formData: FormData = new FormData(); 
    formData.append('file', file);
    formData.append("product",productId);  
  
  const req = new HttpRequest('POST', `${apiUrl}/dms/uploadFile`, formData, {
     reportProgress: true,
     responseType: 'json' 
   }); 

   return this.http.request(req);
 }

  getFiles(productId: string): Observable<any> { 
    let params = new HttpParams().set('product', productId);  
    return this.http.get(`${this.baseUrl}/dms/getProductFiles`,{params:params });
  }

  deleteFile(productId: string): Observable<any> { 
    let params = new HttpParams().set('product', productId);  
    return this.http.get(`${this.baseUrl}/dms/deleteProductImg`,{params:params });
  }
}
