import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({name: 'customer'})
export class Customer extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    FirstName: string;

    @Column()
    LastName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    Age: number;
}