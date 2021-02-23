import {Component, Input, OnInit} from '@angular/core';
import {PageCount, YtResponse} from '../../models/YtResponse';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() currentPage: any;
  @Input() totalPages: any;

  pageCount:any=PageCount;

  constructor() {
  }

  ngOnInit() { 
  }

  counter(i = 1) {
    return new Array(i);
  }
}
