import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DataService } from "../../services/data.service";
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../services/spinner.service";
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from "../../data-access/database.service";
import { User } from "../../data-access/entities/user.entity";
import { Frame } from "../../data-access/entities/frame.entity";
import { FrameDialogComponent } from '../frame-dialog/frame-dialog.component';
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-frame.list',
  templateUrl: './frame.list.component.html',
  styleUrls: ['./frame.list.component.css']
})
export class FrameListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private databaseService: DatabaseService,
    private router: Router,) {
  }

  frames: Frame[] = [];

  displayedColumns = ['Name', 'Description'];
  dataSource: any = [];

  ngOnInit() {
    this.getFrames();
  }

  ngOnDestroy(): void {

  }



  deletePost(id) {

    this.databaseService
      .connection
      .then(() => Frame.delete(id.Id))
      .then(users => {
        this.getFrames();
      })

  }

  editPost(Frame) {

    let objToSend: NavigationExtras = {
      queryParams: {
        id: Frame.Id
      }
    };

    this.router.navigate(['/invoice'], {
      state: { productdetails: objToSend }
    });

  }

  getFrames() {
    console.log("Getting frames");
    this.databaseService
      .connection
      .then(() => Frame.find())
      .then(users => {
        console.log("frames Fetched Successfully");
        console.log(users);
        this.frames = users;
      })
  }

  addFrame(data) {
    const frame = new Frame();
    console.log("Adding the frames");
    frame.Name = data.name;
    frame.Description = data.description;

    this.databaseService
      .connection
      .then(() => frame.save())
      .then(() => {
        this.getFrames();
        console.log("frames added successfully");
      })
      .then(() => {

      })
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(FrameDialogComponent, {
      width: '600px',
      data: 'Add Post'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      console.log(result);
      this.addFrame(result.data);
      //this.dataService.addPost(result.data);
      // this.dataSource = new PostDataSource(this.dataService);
    });
  }
}

