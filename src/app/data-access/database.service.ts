import { Injectable } from '@angular/core';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Settings } from './repositories/settings';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Invoice } from './entities/invoice.entity';
import { Customer } from './entities/customer.entity';
import { Frame } from './entities/frame.entity';
import { ProductMigration } from '../migration-classes/ProductMigration';
import { Entities1609609406888 } from '../migration-classes/1609609406888-Entities';
import { Entities1609613182948 } from '../migration-classes/1609613182948-Entities';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    public connection: Promise<Connection>;
    private readonly options: ConnectionOptions;

    constructor() {
        console.log(Settings.dbPath);
        Settings.initialize();
        this.options = {
            type: 'sqlite',
            database: Settings.dbPath,
            entities: [User, Product, Invoice, InvoiceItem, Customer, Frame],
            synchronize: true,
            migrations: ['migrations'],
            migrationsRun: false,
            logging: 'all',
            cli: {
                migrationsDir: "src/migration"
            }
        };

        this.connection = createConnection(this.options);
    }

} 
