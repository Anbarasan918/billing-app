import {Injectable} from '@angular/core'; 
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  ELEMENT_DATA: any[] = [
    {position: 0, title: 'any One', category: 'Web Development', date_posted: new Date(), body: 'Body 1'},
    {position: 1, title: 'any Two', category: 'Android Development', date_posted: new Date(), body: 'Body 2'},
    {position: 2, title: 'any Three', category: 'IOS Development', date_posted: new Date(), body: 'Body 3'},
    {position: 3, title: 'any Four', category: 'Android Development', date_posted: new Date(), body: 'Body 4'},
    {position: 4, title: 'any Five', category: 'IOS Development', date_posted: new Date(), body: 'Body 5'},
    {position: 5, title: 'any Six', category: 'Web Development', date_posted: new Date(), body: 'Body 6'},
  ];
  categories = [
    {value: 'Web-Development', viewValue: 'Web Development'},
    {value: 'Android-Development', viewValue: 'Android Development'},
    {value: 'IOS-Development', viewValue: 'IOS Development'}
  ];

  constructor() {
  }

  getData(): Observable<any[]> {
    return of<any[]>(this.ELEMENT_DATA);
  }

  getCategories() {
    return this.categories;
  }

  addany(data) {
    this.ELEMENT_DATA.push(data);
  }

  deleteany(index) {
    this.ELEMENT_DATA = [...this.ELEMENT_DATA.slice(0, index), ...this.ELEMENT_DATA.slice(index + 1)];
  }

  dataLength() {
    return this.ELEMENT_DATA.length;
  }
}
