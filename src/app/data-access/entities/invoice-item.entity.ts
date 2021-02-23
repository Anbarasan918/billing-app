import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";

import { Invoice } from './invoice.entity';

@Entity({ name: 'invoiceItem' })
export class InvoiceItem extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ nullable: true })
    productName: string;

    @Column({ nullable: true })
    photoNo: string;

    @Column({ nullable: true })
    photoSize: string;

    @Column({ nullable: true })
    noOfCopies: string;

    @Column({ nullable: true })
    pricePerCopy: number;

    @Column({ nullable: true })
    itemTotal: number;

    @Column({ nullable: true })
    total: number;

    @Column({ nullable: true })
    frame: string;

    @Column({ nullable: true })
    isDataSynced: boolean;

    @ManyToOne(() => Invoice, invoice => invoice.invoiceItems)
    invoice: Invoice;
}