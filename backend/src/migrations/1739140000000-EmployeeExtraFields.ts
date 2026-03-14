import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeeExtraFields1739140000000 implements MigrationInterface {
  name = 'EmployeeExtraFields1739140000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "employees"
        ADD COLUMN IF NOT EXISTS "full_name" character varying,
        ADD COLUMN IF NOT EXISTS "phone" character varying,
        ADD COLUMN IF NOT EXISTS "pnfl" character varying,
        ADD COLUMN IF NOT EXISTS "birth_date" date,
        ADD COLUMN IF NOT EXISTS "passport_series" character varying,
        ADD COLUMN IF NOT EXISTS "passport_number" character varying
    `);
    await queryRunner.query(`
      UPDATE "employees" SET "full_name" = TRIM(CONCAT("first_name", ' ', COALESCE("last_name", '')))
      WHERE "full_name" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "full_name"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "phone"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "pnfl"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "birth_date"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "passport_series"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "passport_number"`);
  }
}
