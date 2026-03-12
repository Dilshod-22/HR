import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeesAndCustomerNames1739130000000 implements MigrationInterface {
  name = 'EmployeesAndCustomerNames1739130000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL DEFAULT '',
        "login" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_employees" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_employees_login" UNIQUE ("login")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "customers"
        ADD COLUMN IF NOT EXISTS "first_name" character varying,
        ADD COLUMN IF NOT EXISTS "last_name" character varying DEFAULT ''
    `);
    await queryRunner.query(`
      UPDATE "customers" SET
        "first_name" = COALESCE(SPLIT_PART(TRIM(COALESCE("full_name", '')), ' ', 1), ''),
        "last_name" = COALESCE(NULLIF(TRIM(SUBSTRING(TRIM(COALESCE("full_name", '')) || ' ' FROM POSITION(' ' IN TRIM(COALESCE("full_name", '')) || ' ') + 1)), ''), '')
      WHERE "first_name" IS NULL
    `);
    await queryRunner.query(`UPDATE "customers" SET "first_name" = COALESCE(NULLIF(TRIM("first_name"), ''), "full_name", 'N/A') WHERE "first_name" IS NULL OR "first_name" = ''`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "first_name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "full_name" DROP NOT NULL`);

    await queryRunner.query(`
      ALTER TABLE "contracts"
        ADD COLUMN IF NOT EXISTS "employeeId" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "contracts"
        ADD CONSTRAINT "FK_contracts_employee"
        FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`CREATE INDEX "IDX_contracts_employeeId" ON "contracts" ("employeeId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_contracts_employeeId"`);
    await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_contracts_employee"`);
    await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "employeeId"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "first_name"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "last_name"`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "full_name" SET NOT NULL`);
    await queryRunner.query(`DROP TABLE "employees"`);
  }
}
