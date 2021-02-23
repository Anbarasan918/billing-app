import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent ,HttpParams } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {apiUrl} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
 
constructor(private http: HttpClient) { }
 
private isSpinnerLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

public toggleSpinner(value) { 
    this.isSpinnerLoading.next(value);
}

isSpinnerPresent(): Observable<boolean> {
    return this.isSpinnerLoading.asObservable();
}
  

   
}
