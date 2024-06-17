import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1718539715300 implements MigrationInterface {
  name = 'InitialMigration1718539715300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "trip" ("id" SERIAL NOT NULL, "start_address" character varying NOT NULL, "destination_address" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "distance" integer NOT NULL, "price" integer NOT NULL, "userId" integer, CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip" ADD CONSTRAINT "FK_f89812be41bd7d29f98d43445ee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trip" DROP CONSTRAINT "FK_f89812be41bd7d29f98d43445ee"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "trip"`);
  }
}
