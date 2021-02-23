import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DataService } from "../../services/data.service";
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../services/spinner.service";
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from "../../data-access/database.service";
import { User } from "../../data-access/entities/user.entity";
import { Product } from "../../data-access/entities/product.entity";
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-product.list',
  templateUrl: './product.list.component.html',
  styleUrls: ['./product.list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private databaseService: DatabaseService,
    private router: Router,) {
  }

  products: Product[] = [];

  displayedColumns = ['Name', 'Quantity', 'Discount', 'Price', 'delete'];
  dataSource: any = [];

  ngOnInit() {
    this.getProducts();
  }

  ngOnDestroy(): void {

  }



  deletePost(id) {

    this.databaseService
      .connection
      .then(() => Product.delete(id.Id))
      .then(users => {
        this.getProducts();
      })

  }

  editPost(product) {

    let objToSend: NavigationExtras = {
      queryParams: {
        id: product.Id
      }
    };

    this.router.navigate(['/invoice'], {
      state: { productdetails: objToSend }
    });

  }

  getProducts() {
    console.log("Getting Products");
    this.databaseService
      .connection
      .then(() => Product.find())
      .then(users => {
        console.log("Products Fetched Successfully");
        console.log(users);
        this.products = users;
      })
  }

  addProduct(data) {
    const product = new Product();
    console.log("Adding the products");
    product.Name = data.name;
    product.Quantity = data.quantity;
    product.Discount = 0;
    product.Price = +data.price;
    product.Size = data.size;
    product.ProductId = "";
    product.isFrameAvailable = data.isFrameAvailable;

    this.databaseService
      .connection
      .then(() => product.save())
      .then(() => {
        this.getProducts();
        console.log("Products added successfully");
      })
      .then(() => {

      })
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(PostDialogComponent, {
      width: '600px',
      data: 'Add Post'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      console.log(result);
      this.addProduct(result.data);
      //this.dataService.addPost(result.data);
      // this.dataSource = new PostDataSource(this.dataService);
    });
  }
}

