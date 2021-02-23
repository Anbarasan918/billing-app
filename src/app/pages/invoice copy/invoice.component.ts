import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatabaseService } from "../../data-access/database.service";
import { Invoice } from "../../data-access/entities/invoice.entity";
import { InvoiceItem } from "../../data-access/entities/invoice-item.entity";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Product } from "../../data-access/entities/product.entity";
import { Frame } from "../../data-access/entities/frame.entity";
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import { Twilio } from 'twilio';

export class InvoiceItems {
  photoNo = '';
  photoSize = '';
  noOfCopies = '';
  pricePerCopy = '';
  Id = null;
  itemTotal = null;
  total = null;
  productName = null;
  frame = null;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  form: FormGroup;
  detailProduct: any = {};


  invoiceId: any = {};

  options: any[] = [];
  frames: any[] = [];

  paymentModes = [];

  public invoice = {
    items: [],
    invoice_date: new Date()
  };

  logoSrc = 'assets/img/logo.jpg';
  filteredOptions: Observable<any[]>[] = [];
  frameOptions: Observable<any[]>[] = [];

  constructor(private fb: FormBuilder, private databaseService: DatabaseService,
    private router: Router, public route: ActivatedRoute) {
    this.createForm();
    this.getProducts();
    this.paymentModes = [{ "code": "CASH", "value": "Cash" }, { "code": "ONLINE", "value": "Online" }];
    this.detailProduct = this.router.getCurrentNavigation().extras.state;
    console.log(this.detailProduct);

    if (this.detailProduct != undefined && this.detailProduct.productdetails != undefined && this.detailProduct.productdetails.queryParams != undefined && this.detailProduct.productdetails.queryParams.id != undefined) {
      this.invoiceId = this.detailProduct.productdetails.queryParams.id;
      this.getOneProduct(this.invoiceId);
    }

  }

  get invoiceItems(): FormArray {
    return this.form.get('invoiceItems') as FormArray;
  };

  toggleLogo() { }
  editLogo() { }

  setSelectedProduct(option, formValue) {
    formValue.get("photoSize").setValue(option.Size);
    formValue.get("pricePerCopy").setValue(option.Price);
    formValue.get("noOfCopies").setValue(option.Quantity);
    formValue.controls.frame[option.isFrameAvailable ? 'enable' : 'disable']();
  }

  getOptionText(option) {
    return option.Name;
  }

  manageNameControl(index: number) {

    var arrayControl = this.invoiceItems;
    this.filteredOptions[index] = arrayControl.at(index).get('productName').valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.frameOptions[index] = arrayControl.at(index).get('frame').valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterFrames(name) : this.frames.slice())
      );

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterFrames(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.frames.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }

  refresh() {
    window.location.reload();
  }

  getProducts() {
    console.log("Getting Products");
    this.databaseService
      .connection
      .then(() => Product.find())
      .then(users => {
        console.log("Products Fetched Successfully");
        console.log(users);
        this.options = users;
        this.getFrames();
      })
  }

  getFrames() {
    console.log("Getting Frames");
    this.databaseService
      .connection
      .then(() => Frame.find())
      .then(users => {
        console.log("Products Fetched Successfully");
        console.log(users);
        this.frames = users;
        this.addItem();
      })
  }

  getOneProduct(id: number) {
    console.log("Getting Products");

    this.databaseService
      .connection
      .then(() => Invoice.findOne({
        relations: ['invoiceItems'],
        where: { Id: id },
      }))
      .then(product => {
        console.log(product);
        console.log(product.Id);

        const invoice = this.form.get('invoiceItems') as FormArray;

        while (invoice.length) {
          invoice.removeAt(0);
        }

        this.form.patchValue(product);

        product.invoiceItems.forEach(invoicItem => invoice.push(this.fb.group(invoicItem)));

        //this.form.get("invoiceItems").setValue(product.invoiceItems);
      })
  }

  addItem() {
    this.invoiceItems.push(this.fb.group(new InvoiceItems()));
    this.manageNameControl(this.invoiceItems.length - 1);
  }

  removeItem(item) {

    let i = this.invoiceItems.controls.indexOf(item);

    if (i != -1) {
      this.invoiceItems.controls.splice(i, 1);
      let items = this.form.getRawValue();
      this.updateForm(items);
    }
  }

  onSubmit() {//f: NgForm){

  }

  invoicePaperPrint() {
    window.print();

  }

  refreshForm() {
    this.createForm();
    this.addItem();
  }

  async printInvoice() {
    var product = new Invoice();
    product = Object.assign(product, this.form.value);
    product.isDataSynced = false;

    var savedInvoice;
    await this.databaseService
      .connection
      .then(() => product.save())
      .then((savedInvoice) => {
        this.createForm();
        this.addItem();
        this.sendSms(savedInvoice);
        this.sendWhatsApp(savedInvoice);
      })

    var invoiceItems: InvoiceItem[] = [];
    invoiceItems = Object.assign([], product.invoiceItems);

    invoiceItems.forEach(async (item) => {
      console.log(item);
      item.invoice = savedInvoice;
      var invoiceItem = new InvoiceItem();
      invoiceItem = Object.assign(invoiceItem, item);

      await this.databaseService
        .connection
        .then(() => invoiceItem.save())
        .then((ffg) => {
          //  this.getProducts();
          console.log(ffg);
        })
        .then(() => {

        })
    });

  }

  onPrintDialogClose() {
    this.printInvoice();
  }

  updateForm(data) {
    const items = data.invoiceItems;
    let sub = 0;
    for (let i of items) {
      i.total = i.noOfCopies * i.pricePerCopy;
      sub += i.total;
    }
    this.form.value.subTotal = sub;
    const tax = sub * (this.form.value.taxPercent / 100);
    this.form.value.tax = tax;
    this.form.value.grantTotal = sub + tax;
    this.form.value.balanceAmount = this.form.value.grantTotal - this.form.value.paidAmount;

  }
  createForm() {


    this.form = this.fb.group({
      customerName: ['', Validators.required],
      invoiceItems: this.fb.array([]),
      subTotal: [0],
      taxPercent: [],
      tax: [0],
      phone: [{ value: "", disabled: false }],
      grantTotal: [0],
      Id: null,
      invoiceDate: [new Date().toLocaleString(), Validators.required],
      customerId: null,
      billAmount: null,
      discount: null,
      parentReference: [this.getBillNo()],
      paidAmount: [0],
      balanceAmount: [0],
      paymentMode: ["CASH"],
      orderDelivered: [true]
    });

    this.form.valueChanges.subscribe(data => this.updateForm(data));

  }

  onError(error) {
    console.log("onError");
  }

  getBillNo() {

    var savedSetting = localStorage.getItem("settings");
    var invoicePrefix = "SS";
    if (savedSetting) {
      try {
        invoicePrefix = JSON.parse(savedSetting).common.invoicePrefix;
      } catch (e) {

      }
    }

    return invoicePrefix + Math.floor(Math.random() * 9000) + 1000;
  }


  onPdfOpen() {
    console.log("onPdfOpen");
  }

  onLoadingStart() {

    console.log("onLoadingStart");
  }

  onLoadingEnd() {
    document.getElementById('invoice-print').style.display = "none";
    console.log("onLoadingEnd");
  }

  public printTable() {
    document.getElementById('invoice-print').style.display = "block";
    /**
     * Convent html into image
     *
     * Look at the
     * {@Link https://github.com/niklasvh/html2canvas}
     */
    html2canvas(document.querySelector('#invoice-print')).then(async (canvas: HTMLCanvasElement) => {
      const toImg = canvas.toDataURL();

      /**
       * Print image
       *
       * Look at the
       * {@Link https://github.com/crabbly/print.js}
       */
      printJS({ printable: `${toImg}`, type: 'image', imageStyle: 'width:100%', onLoadingStart: () => this.onLoadingStart(), onLoadingEnd: () => this.onLoadingEnd(), onError: () => this.onError(Error), onPrintDialogClose: () => this.onPrintDialogClose(), onPdfOpen: () => this.onPdfOpen() });
    });
  }

  sendSms(data) {
    var smsSettings = null;
    var systemSettings = localStorage.getItem("settings");
    systemSettings = JSON.parse(systemSettings);
    if (systemSettings && systemSettings['sms']) {
      smsSettings = systemSettings['sms'];

      const accountSid = smsSettings['accountId'];
      const authToken = smsSettings['authToken'];
      const fromNo = smsSettings['fromNo'];
      const message = smsSettings['message'];

      var finalMessage = this.getDataBindedMessage(message, data);
      let twilio = new Twilio(accountSid, authToken);

      twilio.messages.create({
        body: finalMessage,
        from: fromNo,
        to: "+918438314580"
      }).then(message => console.log(message.sid));
    }


  }

  sendWhatsApp(data) {
    var whatsAppSettings = null;
    var systemSettings = localStorage.getItem("settings");
    systemSettings = JSON.parse(systemSettings);
    if (systemSettings && systemSettings['whatsApp']) {
      whatsAppSettings = systemSettings['whatsApp'];

      const accountSid = whatsAppSettings['accountId'];
      const authToken = whatsAppSettings['authToken'];
      const fromNo = whatsAppSettings['fromNo'];
      const message = whatsAppSettings['message'];

      var finalMessage = this.getDataBindedMessage(message, data);

      let twilio = new Twilio(accountSid, authToken);

      twilio.messages
        .create({
          body: finalMessage,
          from: 'whatsapp:' + fromNo,
          to: 'whatsapp:+918438314580'
        })
        .then(message => console.log(message.sid));
    }

  }

  getDataBindedMessage(message, data) {

    if (!message)
      return "";
    return message.replace('${customerId}', data.customerId)
      .replace('${invoiceDate}', data.invoiceDate)
      .replace('${customerName}', data.customerName)
      .replace('${phone}', data.phone)
      .replace('${parentReference}', data.parentReference)
      .replace('${paidAmount}', data.paidAmount)
      .replace('${balanceAmount}', data.balanceAmount)
      .replace('${grantTotal}', data.grantTotal);
  }

}


