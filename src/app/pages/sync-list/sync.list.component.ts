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

@Component({
  selector: 'app-sync.list',
  templateUrl: './sync.list.component.html',
  styleUrls: ['./sync.list.component.css']
})
export class SyncListComponent implements OnInit, OnDestroy {

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

  getInvoices(page: number = 1, size: number = 10) {
    this.spinnerService.toggleSpinner(true);
    this.productService.getSyncedInvoices(page, size, this.filter)
      .subscribe(response => {
        this.products = response.response;
        this.length = response.totalCount;
        this.spinnerService.toggleSpinner(false);
      },(error: any) => {
        this.spinnerService.toggleSpinner(false); 
      });
  }


  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  getServerData(paginationEvent) {
    console.log(paginationEvent);
    this.getInvoices(paginationEvent.pageIndex + 1, paginationEvent.pageSize);
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

