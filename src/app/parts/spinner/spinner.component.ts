import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, Input } from '@angular/core';
import { SpinnerService } from "../../services/spinner.service";

@Component({
  selector: 'spinner',
  template: `
    <ngx-spinner bdColor = "rgba(0, 0, 0, 0.8)" size = "medium" color = "#fff" type = "ball-scale-pulse" [fullScreen] = "true"><p style="color: white" > Loading... </p></ngx-spinner>
      `
})
export class SpinnerComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private spinnerService: SpinnerService) {

  }

  isSpinnerLoading: boolean = false;

  ngOnInit() {

    this.spinnerService.isSpinnerPresent().subscribe(isLoading => {
      if (isLoading)
        this.showLoader();
      else if (!isLoading)
        this.offLoader();
    });

  }


  showLoader() {
    console.log("show");
    this.spinner.show();
  }

  offLoader() {
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

  }

}