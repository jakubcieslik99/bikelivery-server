import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnTypeMigration1676651894119 implements MigrationInterface {
  name = 'ChangeColumnTypeMigration1676651894119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trips" ALTER COLUMN "price" TYPE double precision`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trips" ALTER COLUMN "price" TYPE integer`);
  }
}
