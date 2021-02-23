import { MigrationInterface, QueryRunner } from "typeorm";

export class Entities1609609406888 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE frame ADD COLUMN Description TEXT;`);

        await queryRunner.query(`CREATE TABLE frame ( Id INTEGER PRIMARY KEY,Name TEXT,Description TEXT);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
