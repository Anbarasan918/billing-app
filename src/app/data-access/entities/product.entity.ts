import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: 'product' })
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ nullable: true })
    ProductId: string;

    @Column({ nullable: true })
    Name: string;

    @Column({ nullable: true })
    Description: string;

    @Column({ nullable: true })
    Quantity: number;

    @Column({ nullable: true })
    Size: string;

    @Column({ nullable: true })
    Discount: number;

    @Column({ nullable: true })
    Price: number;

    @Column({ nullable: true })
    isFrameAvailable: number;
}