import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductMigration implements MigrationInterface {
    name?: string;
    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE product ADD COLUMN NewTestCloumn INTEGER;`);
    }
    async down(queryRunner: QueryRunner): Promise<any> {
        //await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "name" RENAME TO "title"`);
    }

}