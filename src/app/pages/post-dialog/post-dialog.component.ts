import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent {
  product = {
    name: '',
    quantity: 0,
    price: 0,
    position: 0,
    discount: 0,
    size: '',
    isFrameAvailable: ""
  };
  categories;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataService
  ) {
    this.categories = this.dataService.getCategories();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.product.position = this.dataService.dataLength();
    this.event.emit({ data: this.product });
    this.dialogRef.close();
  }

}
