import { Component } from '@angular/core';
import { DatabaseService } from "./data-access/database.service";
import { ProductService } from "./services/product.service";
import { User } from "./data-access/entities/user.entity";
import { UserService } from "./services/user.service";
import { DataService } from "./services/data.service";
import { SpinnerService } from "./services/spinner.service";
import { MatDialog } from '@angular/material/dialog';
import { Invoice } from "./data-access/entities/invoice.entity";
import { InvoiceItem } from './data-access/entities/invoice-item.entity';
import { getConnection } from "typeorm";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    users: User[] = [];
    displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'Age'];
    invoices = [];

    firstName: string = '';
    lastName: string = '';
    age: string = '';

    constructor(private databaseService: DatabaseService,
        private productService: ProductService,
        private userService: UserService,
        private dataService: DataService,
        private spinnerService: SpinnerService,
        public dialog: MatDialog) {
        this.getUsers();

        const CronJob = require('cron').CronJob;

        console.log('Before job instantiation');
        const job = new CronJob('0 */1 * * * *', () => {
            const d = new Date();
            console.log('Starting the job:', d);
            this.getInvoices();
        });
        console.log('After job instantiation');
        job.start();

    }

    getJobData() {
        this.productService.getJobData()
            .subscribe(response => {
                console.log(response);
            });
    }

    getUsers() {
        this.databaseService
            .connection
            .then(() => User.find())
            .then(users => {
                this.users = users;
            })
    }

    addUser() {
        const user = new User();

        user.FirstName = this.firstName;
        user.LastName = this.lastName;
        user.Age = +this.age;

        this.databaseService
            .connection
            .then(() => user.save())
            .then(() => {
                this.getUsers();
            })
            .then(() => {
                this.firstName = '';
                this.lastName = '';
                this.age = '';
            })
    }

    getInvoices() {
        console.log("Getting Products");
        this.databaseService
            .connection
            .then(() => Invoice.find({
                where: { isDataSynced: false },
                relations: ['invoiceItems'],
            }))
            .then(invoices => {
                invoices.forEach(item => {
                    item['clientInvoiceId'] = item.Id;
                    item['uuid'] = item.serverId;
                });
                this.invoices = invoices;
                this.saveInvoices(this.invoices);
            })
    }

    saveInvoices(invoices) {

        this.productService.saveInvoices(invoices)
            .subscribe(response => {
                console.log(response);
                this.updateInvoices(response);
            });
    }

    async updateInvoices(invoiceList) {

        invoiceList.response.forEach(async item => {
            await getConnection()
                .createQueryBuilder()
                .update(Invoice)
                .set({ isDataSynced: true, serverId: item.uuid })
                .where("id = :id", { id: item.clientInvoiceId })
                .execute();
        });
        // invoiceList.forEach(async item => {
        //     var invoice = new Invoice();
        //     invoice= Object.assign(invoice, item);
        //     await this.databaseService 
        //     .connection
        //     .then(() => Invoice.update<Invoice>(Invoice, {isDataSynced: true})
        //     .where("user.id = :id", { id: 1 }))
        //     .then((ffg) => {
        //     //  this.getProducts();
        //     console.log(ffg);
        //     })
        //     .then(() => {

        //     })
        // });

    }

}
