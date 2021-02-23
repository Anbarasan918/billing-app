import { User } from '../data-access/entities/user.entity';
import { Product } from '../data-access/entities/product.entity';
import { InvoiceItem } from '../data-access/entities/invoice-item.entity';
import { Invoice } from '../data-access/entities/invoice.entity';
import { Customer } from '../data-access/entities/customer.entity';

import * as path from 'path';
import { remote } from 'electron';
import { environment } from '../../environments/environment';


var dataSubFolder;
var appPath;
var dbPath;
var dbFolder;
var dbName = 'database.db';

if (environment.production) {
    dataSubFolder = '/';
    appPath = remote.app.getPath('userData');
} else {
    // return folder where app is running
    dataSubFolder = '/db';
    appPath = remote.app.getAppPath();
}

dbFolder = path.join(appPath, dataSubFolder);
dbPath = path.join(dbFolder, dbName);

console.log(dbPath);

var config = {
    type: 'sqlite',
    database: appPath,
    entities: [User, Product, Invoice, InvoiceItem, Customer],
    synchronize: false,
    migrations: ['migrations'],
    migrationsRun: true,
    logging: 'all',
    cli: {
        migrationsDir: "src/migration"
    }
};

export default config;
