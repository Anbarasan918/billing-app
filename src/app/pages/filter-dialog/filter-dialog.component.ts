import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent {
  product = {orderDelivered:true};
  categories;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataService
  ) {
    console.log(data);
    this.product = Object.assign(this.product,data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.event.emit({ data: this.product });
    this.dialogRef.close();
  }

}
