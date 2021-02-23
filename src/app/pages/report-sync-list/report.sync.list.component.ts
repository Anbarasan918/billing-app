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
  selector: 'app-report-sync.list',
  templateUrl: './report.sync.list.component.html',
  styleUrls: ['./report.sync.list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReportSyncListComponent implements OnInit, OnDestroy {

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
  filter:any = {};
  displayedColumns = ['parentReference', 'customerName', 'invoiceDate', 'grantTotal', 'paidAmount', 'balanceAmount', 'paymentMode', 'orderDelivered'];
  dataSource: any = [];
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  expandedElement: any | null;

  ngOnInit() {
  //  this.getInvoices();
  }

  ngOnDestroy(): void {

  }


  openDialog(): void {
    this.filter.showDateFilter=true;
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

    
  getInvoices(page: number = 1, size: number = 10) {

    const { dialog } = require('electron').remote;  
    var options = {
      type: 'question',
      buttons: ['Ok'],
      defaultId: 2,
      title: '"Notification"',
      message: '', 
    };

    this.spinnerService.toggleSpinner(true);
    this.productService.generateReports(page, size, this.filter)
      .subscribe(response => {
        this.spinnerService.toggleSpinner(false);
        options.message='Report has been generated and sent to your mail Successfully.';
        dialog.showMessageBox(null, options, (response, checkboxChecked) => { 
        });
      },(error: any) => {
        this.spinnerService.toggleSpinner(false);
        options.message='Unable to generate Report';
        dialog.showMessageBox(null, options, (response, checkboxChecked) => { 
        });
      });
  } 

  getServerData(paginationEvent) { 
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

