import { Component, Input, OnChanges,ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatabaseService } from "../../data-access/database.service";
import { Invoice } from "../../data-access/entities/invoice.entity";
import { InvoiceItem } from "../../data-access/entities/invoice-item.entity";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Product } from "../../data-access/entities/product.entity";
import { Frame } from "../../data-access/entities/frame.entity"; 
import { Twilio } from 'twilio';
import { remote } from 'electron';
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';

export class InvoiceItems {
  photoNo = this.getPhotoNo();
  photoSize = '';
  noOfCopies = '';
  pricePerCopy = '';
  Id = null;
  itemTotal = null;
  total = null;
  productName = null;
  frame = null;

  getPhotoNo() { 
    var savedSetting = localStorage.getItem("settings");
    var invoicePrefix = "SS";
    if (savedSetting) {
      try {
        invoicePrefix = JSON.parse(savedSetting).common.invoicePrefix;
      } catch (e) {

      }
    } 
    return invoicePrefix;
  }
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  form: FormGroup;
  detailProduct: any = {}; 
  isPaidAmountEdited:boolean =false;
  invoiceId: any = {};
  @ViewChild('paidAmountVal') paidAmountVal: ElementRef;
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
     
    this.databaseService
      .connection
      .then(() => Product.find())
      .then(users => { 
        this.options = users;
        this.getFrames();
      })
  }

  getFrames() {
     
    this.databaseService
      .connection
      .then(() => Frame.find())
      .then(users => { 
        this.frames = users;
        this.addItem();
      })
  }

  getOneProduct(id: number) {
      
    this.databaseService
      .connection
      .then(() => Invoice.findOne({
        relations: ['invoiceItems'],
        where: { Id: id },
      }))
      .then(product => {
        
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

  refreshForm() {
    this.paidAmountVal.nativeElement.value=0;
    this.createForm();
    this.addItem();
  }

  async saveInvoice() {
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
       
      item.invoice = savedInvoice;
      var invoiceItem = new InvoiceItem();
      invoiceItem = Object.assign(invoiceItem, item);

      await this.databaseService
        .connection
        .then(() => invoiceItem.save())
        .then((ffg) => {
           
        })
        .then(() => {

        })
    });

  }


  updateForm(data,paidAmountVal:any=null) {
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
    if(!this.isPaidAmountEdited &&  this.form.value.paidAmount!=this.form.value.grantTotal && this.form.value.Id==null && this.form.value.grantTotal>0)
    {  
      this.form.value.paidAmount = this.form.value.grantTotal; 
      this.paidAmountVal.nativeElement.value=this.form.value.grantTotal;
    }else if(this.isPaidAmountEdited && paidAmountVal!=null){ 
      this.form.value.paidAmount = paidAmountVal; 
    }else if(this.isPaidAmountEdited && paidAmountVal==null){
      this.form.value.paidAmount = this.paidAmountVal.nativeElement.value; 
    } 
    this.form.value.balanceAmount = this.form.value.grantTotal - this.form.value.paidAmount; 
     
  }   

  updatePaidAmount(value){ 
      if(value.target && value.target.value){   
        this.updateForm(this.form.value,value.target.value);
      } 
   } 
 
   enablePaidAMountField(paidAmountVal){ 
       this.isPaidAmountEdited=true; 
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
    return "INV" + Math.floor(Math.random() * 9000) + 1000;
  }
 

public validateInvoice(){ 

  const { dialog } = require('electron').remote; 

  var options = {
    type: 'question',
    buttons: ['Ok'],
    defaultId: 2,
    title: '"Notification"',
    message: '', 
  };
  
    if(!this.form.value.customerName){
        options.message='Please Enter Customer Name';
        dialog.showMessageBox(null, options, (response, checkboxChecked) => { 
        });
       return; 
    } 

    if(this.form.value.invoiceItems.length<=0){
      options.message='Please add atleast one product';
      dialog.showMessageBox(null, options, (response, checkboxChecked) => { 
      });
      return; 
    }   

    var isInvaildItemFound=false;
    this.form.value.invoiceItems.forEach(item => {
      if(!item.productName || !item.photoNo || !item.noOfCopies || !item.pricePerCopy )
      isInvaildItemFound=true;
    });

    if(isInvaildItemFound){
      options.message='Please enter valid product details';
      dialog.showMessageBox(null, options, (response, checkboxChecked) => { 
      });
      return;   
    }  

    var printInvoice=false;
    var systemSettings = localStorage.getItem("settings");
    if(systemSettings){ 
      systemSettings = JSON.parse(systemSettings);
      if (systemSettings && systemSettings['common'] && systemSettings['common'].printInvoice) {
          printInvoice=true;
      }
    } 

    if(printInvoice) this.printReceipt(); else this.saveInvoice();
}
  
  public printReceipt() {
    const {PosPrinter} = remote.require("electron-pos-printer");
    const path = require("path");

    const options = {
      silent:true,
      preview: false,                
      width: '250px',                
      margin: '0 0 0 0',             
      copies: 1,                 
      timeOutPerLine: 400,
      pageSize: { height: 301000, width: 71000 }  // page size
    }

  const data = [ 
    {
        type: 'text',                                       
        value: 'Seenu Modelling Studio',
        style: `text-align:center;`,
        css: {"font-weight": "700", "font-size": "18px"}
    },{
        type: 'text',                      
        value: 'Photography & Videography',
        style: `text-align:center;`,
        css: {"text-decoration": "underline", "font-size": "10px"}
    }, 
    {
      type: 'text',                      
      value: 'Mangadu, Chennai',
      style: `text-align:center;`,
      css: {"text-decoration": "underline", "font-size": "10px"}
  }, 
  {
    type: 'text',                      
    value: '9710456088,9962666088',
    style: `text-align:center;`,
    css: {"text-decoration": "underline", "font-size": "10px"}
  }, 
    {
        type: 'table',  
        tableHeader: ['BILL #', 'Date'], 
        tableBody: [[this.form.value.parentReference, this.form.value.invoiceDate]],  
        tableFooterStyle: 'background-color: #000; color: white;',
      },{
        type: 'table',  
        tableHeader: ['Name', 'Phone'], 
        tableBody: [[this.form.value.customerName, this.form.value.phone]],   
        tableFooterStyle: 'background-color: #000; color: white;',
    },
    {
        type: 'table',             
        tableHeader: [{type: 'text', value: 'Product'},{type: 'text', value: 'Photo #'},{type: 'text', value: 'Quantity'},{type: 'text', value: 'Total'}],
        tableBody: this.getPrintableInvoiceItems()
      },
      {
        type: 'text',                      
        value: 'Sub Total : ₹' + this.form.value.subTotal,
        style: `text-align:right;margin-top:8px;`,
        css: {"font-size": "15px"}
    }, 
    {
      type: 'text',                      
      value: 'Tax : ₹' + this.form.value.tax,
      style: `text-align:right;margin-top:8px;`,
      css: {"font-size": "15px"}
  }, 
  {
    type: 'text',                      
    value: 'Total : ₹' + this.form.value.grantTotal,
    style: `text-align:right;margin-top:8px;`,
    css: {"font-size": "15px"}
  }, 
  {
    type: 'text',                      
    value: 'Paid : ₹' + this.form.value.paidAmount,
    style: `text-align:right;margin-top:8px;`,
    css: {"font-size": "15px"}
  }, 
  {
    type: 'text',                      
    value: 'Balance : ₹' + this.form.value.balanceAmount,
    style: `text-align:right;margin-top:8px;`,
    css: {"font-size": "15px"}
  }, 
  {
    type: 'text',                      
    value: 'Thank You for shopping with us..!',
    style: `text-align:center;margin-top:3px;`,
    css: {"font-size": "12px"}
  }
  ]

PosPrinter.print(data, options)
 .then(() => {
  this.saveInvoice();
  console.error("Success");
 })
 .catch((error) => {
    console.error(error);
    this.saveInvoice();
  });
  }

   
  getPrintableInvoiceItems(){
    var lineItems=[];
    this.form.value.invoiceItems.forEach(item => { 
      var line=[];
      line.push({"type":"text",value:item.productName});
      line.push({"type":"text",value:item.photoNo});
      line.push({"type":"text",value:item.noOfCopies});
      line.push({"type":"text",value:item.total});
      lineItems.push(line);
    });

    return lineItems;
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
      const sendMsg = smsSettings['sendMsg'];

      var finalMessage = this.getDataBindedMessage(message, data);
      if(sendMsg && accountSid && authToken && fromNo){
          let twilio = new Twilio(accountSid, authToken);
          twilio.messages.create({
            body: finalMessage,
            from: fromNo,
            to: "+918438314580"
          }).then(message => console.log(message.sid));
      }
      
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
      const sendMsg = whatsAppSettings['sendMsg'];

      var finalMessage = this.getDataBindedMessage(message, data);
      if(sendMsg && accountSid && authToken && fromNo){
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


