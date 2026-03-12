import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractsAndCustomers1739120000000 implements MigrationInterface {
  name = 'ContractsAndCustomers1739120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customers"
        ADD COLUMN IF NOT EXISTS "full_name" character varying,
        ADD COLUMN IF NOT EXISTS "birthDate" date,
        ADD COLUMN IF NOT EXISTS "passport_series" character varying,
        ADD COLUMN IF NOT EXISTS "passport_number" character varying,
        ADD COLUMN IF NOT EXISTS "region" character varying,
        ADD COLUMN IF NOT EXISTS "district" character varying,
        ADD COLUMN IF NOT EXISTS "workplace" character varying
    `);
    await queryRunner.query(`UPDATE "customers" SET "full_name" = "name" WHERE "full_name" IS NULL`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "full_name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "name"`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "email" DROP NOT NULL`);

    await queryRunner.query(`
      CREATE TABLE "interest_rates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "year" integer NOT NULL,
        "term_months" integer NOT NULL,
        "percentage" numeric(5,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_interest_rates" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "contracts_status_enum" AS ENUM ('draft', 'active', 'completed', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE "payment_schedules_status_enum" AS ENUM ('pending', 'paid')
    `);

    await queryRunner.query(`
      CREATE TABLE "contracts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "guarantor_name" character varying NOT NULL,
        "guarantor_phone" character varying,
        "term_months" integer NOT NULL,
        "interestRateId" uuid NOT NULL,
        "product_total" numeric(14,2) NOT NULL,
        "interest_amount" numeric(14,2) NOT NULL,
        "total_amount" numeric(14,2) NOT NULL,
        "monthly_amount" numeric(14,2) NOT NULL,
        "status" "contracts_status_enum" NOT NULL DEFAULT 'draft',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contracts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_contracts_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_contracts_interest_rate" FOREIGN KEY ("interestRateId") REFERENCES "interest_rates"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "contract_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "contractId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        "quantity" integer NOT NULL DEFAULT 1,
        "unit_price" numeric(12,2) NOT NULL,
        CONSTRAINT "PK_contract_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_contract_items_contract" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_contract_items_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "payment_schedules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "contractId" uuid NOT NULL,
        "month_number" integer NOT NULL,
        "due_date" date NOT NULL,
        "amount" numeric(14,2) NOT NULL,
        "paid_at" TIMESTAMP,
        "status" "payment_schedules_status_enum" NOT NULL DEFAULT 'pending',
        CONSTRAINT "PK_payment_schedules" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payment_schedules_contract" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "receipts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "contractId" uuid NOT NULL,
        "paymentScheduleId" uuid NOT NULL,
        "amount" numeric(14,2) NOT NULL,
        "receipt_number" character varying NOT NULL,
        "paid_at" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_receipts" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_receipts_receipt_number" UNIQUE ("receipt_number"),
        CONSTRAINT "FK_receipts_contract" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_receipts_schedule" FOREIGN KEY ("paymentScheduleId") REFERENCES "payment_schedules"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_contracts_customerId" ON "contracts" ("customerId")`);
    await queryRunner.query(`CREATE INDEX "IDX_contract_items_contractId" ON "contract_items" ("contractId")`);
    await queryRunner.query(`CREATE INDEX "IDX_payment_schedules_contractId" ON "payment_schedules" ("contractId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_payment_schedules_contractId"`);
    await queryRunner.query(`DROP INDEX "IDX_contract_items_contractId"`);
    await queryRunner.query(`DROP INDEX "IDX_contracts_customerId"`);
    await queryRunner.query(`DROP TABLE "receipts"`);
    await queryRunner.query(`DROP TABLE "payment_schedules"`);
    await queryRunner.query(`DROP TABLE "contract_items"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TABLE "interest_rates"`);
    await queryRunner.query(`DROP TYPE "payment_schedules_status_enum"`);
    await queryRunner.query(`DROP TYPE "contracts_status_enum"`);

    await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN "name" character varying`);
    await queryRunner.query(`UPDATE "customers" SET "name" = "full_name"`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "full_name"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "birthDate"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "passport_series"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "passport_number"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "region"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "district"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN IF EXISTS "workplace"`);
    await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "email" SET NOT NULL`);
  }
}
