import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DataService } from "../../services/data.service";
import { ActivatedRoute } from "@angular/router";
import { SpinnerService } from "../../services/spinner.service";
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from "../../data-access/database.service";
import { User } from "../../data-access/entities/user.entity";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private databaseService: DatabaseService,
    private router: Router,) {
  }

  settings = { common: {printInvoice:true}, whatsApp: {}, sms: {} };

  ngOnInit() {
    var savedSetting = localStorage.getItem("settings");
    if (savedSetting) {
      this.settings = Object.assign(this.settings, JSON.parse(savedSetting));
    }
  }

  saveSettings() {
    localStorage.setItem("settings", JSON.stringify(this.settings));
    console.log(localStorage.getItem("settings"));
  }


  ngOnDestroy(): void {

  }




}

