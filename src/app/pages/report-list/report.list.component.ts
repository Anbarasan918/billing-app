import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DataService } from "../../services/data.service";
import { SpinnerService } from "../../services/spinner.service";
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from "../../data-access/database.service";
import { User } from "../../data-access/entities/user.entity";
import { Invoice } from "../../data-access/entities/invoice.entity";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { PageEvent } from '@angular/material/paginator';
import { FilterDialogComponent } from "../filter-dialog/filter-dialog.component";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelHelper } from '../../utills/excel.helper';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-report.list',
  templateUrl: './report.list.component.html',
  styleUrls: ['./report.list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReportListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
    private productService: ProductService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private databaseService: DatabaseService,
    private router: Router) {
  }

  products: Invoice[] = [];
  filter = {};
  displayedColumns = ['parentReference', 'customerName', 'invoiceDate', 'grantTotal', 'paidAmount', 'balanceAmount', 'paymentMode', 'orderDelivered'];
  dataSource: any = [];
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  expandedElement: any | null;

  ngOnInit() {
    this.getInvoices();
  }

  ngOnDestroy(): void {

  }


  openDialog(): void {
    let dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '600px',
      data: this.filter
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      console.log(result);
      this.filter = result.data;

      for (var key in this.filter ) {
        if (this.filter.hasOwnProperty(key) && this.filter[key] =="") {
          delete this.filter[key];
        }
    }
      
      this.getInvoices();
    });
  }

  deletePost(id) {

    this.databaseService
      .connection
      .then(() => Invoice.delete(id.Id))
      .then(users => {
        this.getInvoices();
      })

  }

  editPost(product) {

    let objToSend: NavigationExtras = {
      queryParams: {
        id: product.Id
      }
    };

    this.router.navigate(['/invoice'], {
      state: { productdetails: objToSend }
    });

  }
 
  getInvoices(page: number = 0, size: number = 10) {
    console.log("Getting Products");
    this.spinnerService.toggleSpinner(true);
    this.databaseService
      .connection
      .then(() => Invoice.find({ skip: page, take: size, where: this.filter, order: { Id: 'DESC' } }))
      .then(users => {
        console.log("Products Fetched Successfully");
        console.log(users);
        this.products = users;
        this.spinnerService.toggleSpinner(false);
      })
  }

  getServerData(paginationEvent) {
    console.log(paginationEvent);
    this.getInvoices(paginationEvent.pageIndex * paginationEvent.pageSize, paginationEvent.pageSize);
  }


 
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

   

  public exportToExcel(name: string): void {
    var invoiceList = [];
    this.products.forEach(item => {
      var invoice = {};
      invoice["Bill #"] = item.parentReference;
      invoice["Name"] = item.customerName;
      invoice["Date"] = item.invoiceDate;
      invoice["Bill Amount"] = item.grantTotal;
      invoice["Paid Amount"] = item.paidAmount;
      invoice["Balance Amount"] = item.balanceAmount;
      invoiceList.push(invoice);
    });

    const excelHelper = new ExcelHelper(XLSX, saveAs);
    excelHelper.exportAsExcelFile(invoiceList, "Invoices");
  }

}

