import { MigrationInterface, QueryRunner } from 'typeorm';

export class StockAndGroups1739180000000 implements MigrationInterface {
  name = 'StockAndGroups1739180000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_groups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_groups" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_product_groups_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "counterparties" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "phone" character varying,
        "tin" character varying,
        "address" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_counterparties" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "products"
        ADD COLUMN IF NOT EXISTS "purchasePrice" numeric(12,2) NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "stockQty" integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "groupId" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_group" FOREIGN KEY ("groupId")
      REFERENCES "product_groups"("id") ON DELETE SET NULL
    `).catch(() => {});

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "stock_receipts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "counterpartyId" uuid NOT NULL,
        "employeeId" uuid,
        "receiptDate" date NOT NULL,
        "note" character varying,
        "totalAmount" numeric(14,2) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stock_receipts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_stock_receipts_counterparty" FOREIGN KEY ("counterpartyId") REFERENCES "counterparties"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_stock_receipts_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "stock_receipt_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "receiptId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "purchasePrice" numeric(14,2) NOT NULL,
        "salePrice" numeric(14,2) NOT NULL,
        "lineTotal" numeric(14,2) NOT NULL,
        CONSTRAINT "PK_stock_receipt_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_stock_receipt_items_receipt" FOREIGN KEY ("receiptId") REFERENCES "stock_receipts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_stock_receipt_items_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "stock_receipt_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stock_receipts"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_group"`);
    await queryRunner.query(`
      ALTER TABLE "products"
      DROP COLUMN IF EXISTS "groupId",
      DROP COLUMN IF EXISTS "stockQty",
      DROP COLUMN IF EXISTS "purchasePrice"
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS "counterparties"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_groups"`);
  }
}

