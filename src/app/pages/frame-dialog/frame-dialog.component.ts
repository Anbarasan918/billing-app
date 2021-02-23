import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-frame-dialog',
  templateUrl: './frame-dialog.component.html',
  styleUrls: ['./frame-dialog.component.css']
})
export class FrameDialogComponent {
  product = {
    name: '',
    description: ''
  };
  categories;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<FrameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataService
  ) {
    this.categories = this.dataService.getCategories();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.event.emit({ data: this.product });
    this.dialogRef.close();
  }

}
