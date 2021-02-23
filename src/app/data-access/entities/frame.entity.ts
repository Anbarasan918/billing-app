import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: 'frame' })
export class Frame extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ nullable: true })
    Name: string;

    @Column({ nullable: true })
    Description: string;

}