import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReceiptPaymentMethodNotes1739170000000 implements MigrationInterface {
  name = 'ReceiptPaymentMethodNotes1739170000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "receipts"
        ADD COLUMN IF NOT EXISTS "payment_method" character varying
    `);
    await queryRunner.query(`
      ALTER TABLE "receipts"
        ADD COLUMN IF NOT EXISTS "notes" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN IF EXISTS "notes"`);
    await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN IF EXISTS "payment_method"`);
  }
}
