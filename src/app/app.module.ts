import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from "./_interceptors/error-interceptor.service";

import { NavigationComponent } from './parts/navigation/navigation.component';
import { ProductListComponent } from './pages/product-list/product.list.component';
import { PostDialogComponent } from './pages/post-dialog/post-dialog.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InvoiceListComponent } from './pages/invoice-list/invoice.list.component';
import { FrameListComponent } from './pages/frame-list/frame.list.component';
import { FrameDialogComponent } from './pages/frame-dialog/frame-dialog.component';
import { SyncListComponent } from './pages/sync-list/sync.list.component';
import { ReportListComponent } from './pages/report-list/report.list.component';
import { ReportSyncListComponent } from './pages/report-sync-list/report.sync.list.component';
import { FilterDialogComponent } from './pages/filter-dialog/filter-dialog.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SpinnerComponent } from './parts/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ProductListComponent,
    PostDialogComponent,
    InvoiceComponent,
    InvoiceListComponent,
    FrameDialogComponent,
    FilterDialogComponent,
    FrameListComponent,
    SyncListComponent,
    ReportListComponent,
    ReportSyncListComponent,
    SpinnerComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxPrintModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    PostDialogComponent,
    FrameDialogComponent,
    FilterDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
