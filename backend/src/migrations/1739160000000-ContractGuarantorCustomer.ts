import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractGuarantorCustomer1739160000000 implements MigrationInterface {
  name = 'ContractGuarantorCustomer1739160000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contracts"
        ADD COLUMN IF NOT EXISTS "guarantorCustomerId" uuid NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "contracts"
        DROP COLUMN IF EXISTS "guarantor_phone"
    `);
    await queryRunner.query(`
      ALTER TABLE "contracts"
        ADD CONSTRAINT "FK_contract_guarantor_customer"
        FOREIGN KEY ("guarantorCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL
    `).catch(() => { /* constraint may already exist */ });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contracts" DROP CONSTRAINT IF EXISTS "FK_contract_guarantor_customer"
    `);
    await queryRunner.query(`
      ALTER TABLE "contracts" DROP COLUMN IF EXISTS "guarantorCustomerId"
    `);
    await queryRunner.query(`
      ALTER TABLE "contracts"
        ADD COLUMN IF NOT EXISTS "guarantor_phone" character varying
    `);
  }
}
