import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";

import { InvoiceItem } from './invoice-item.entity';

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;


    @Column({ nullable: true })
    invoiceDate: Date;

    @Column({ nullable: true })
    customerId: string;

    @Column({ nullable: true })
    customerName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    billAmount: number;

    @Column({ nullable: true })
    discount: number;

    @Column({ nullable: true })
    parentReference: string;

    @Column({ nullable: true })
    subTotal: number;

    @Column({ nullable: true })
    tax: number;

    @Column({ nullable: true })
    taxPercent: number;

    @Column({ nullable: true })
    paidAmount: number;

    @Column({ nullable: true })
    balanceAmount: number;

    @Column({ nullable: true })
    grantTotal: number;

    @Column({ nullable: true })
    isDataSynced: boolean;

    @Column({ nullable: true })
    serverId: string;

    @Column({ nullable: true })
    orderDelivered: boolean;

    @Column({ nullable: true })
    paymentMode: string;

    @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.invoice, { cascade: ['insert', 'update'] })
    invoiceItems: InvoiceItem[];


}