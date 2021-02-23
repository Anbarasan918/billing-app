import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from "./enum/Role";
import { AuthGuard } from "./_guards/auth.guard";
import { ProductListComponent } from "./pages/product-list/product.list.component";
import { PostDialogComponent } from "./pages/post-dialog/post-dialog.component";
import { InvoiceComponent } from "./pages/invoice/invoice.component";
import { InvoiceListComponent } from "./pages/invoice-list/invoice.list.component";
import { FrameListComponent } from "./pages/frame-list/frame.list.component";
import { SyncListComponent } from "./pages/sync-list/sync.list.component";
import { ReportListComponent } from "./pages/report-list/report.list.component";
import { ReportSyncListComponent } from "./pages/report-sync-list/report.sync.list.component";
import { SettingsComponent } from "./pages/settings/settings.component";

const routes: Routes = [

  {
    path: 'product',
    component: ProductListComponent
  }, {
    path: 'product/new',
    component: PostDialogComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  },
  {
    path: 'invoice-list',
    component: InvoiceListComponent
  },
  {
    path: 'sync',
    component: SyncListComponent
  },
  {
    path: 'reports',
    component: ReportListComponent
  },
  {
    path: 'syncedReports',
    component: ReportSyncListComponent
  },
  {
    path: 'frames',
    component: FrameListComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  { path: '**', redirectTo: 'invoice' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
