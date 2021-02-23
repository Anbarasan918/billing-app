import { MigrationInterface, QueryRunner } from "typeorm";

export class Entities1609613182948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE frame ADD COLUMN Description TEXT;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
