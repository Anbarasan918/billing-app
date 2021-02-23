import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  opened: boolean = true;

  fillerNav = [{ "menu": "Retail Billing", "path": "invoice" },
  { "menu": "Product Entry", "path": "product" },
  { "menu": "Invoices", "path": "invoice-list" },
  { "menu": "Frames", "path": "frames" },
  { "menu": "Reports", "path": "reports" },
  { "menu": "Generate Reports", "path": "syncedReports" },
  { "menu": "Synced Incoices", "path": "sync" },
  { "menu": "Settings", "path": "settings" }
  ];

  fillerContent = Array.from({ length: 50 }, () =>
    ``);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

}
