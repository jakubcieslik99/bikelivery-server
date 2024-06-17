import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceTypeChange1718540282936 implements MigrationInterface {
    name = 'PriceTypeChange1718540282936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "trip" ADD "price" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "trip" ADD "price" integer NOT NULL`);
    }

}
