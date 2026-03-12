import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1739112000000 implements MigrationInterface {
  name = 'InitialSchema1739112000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TYPE "orders_status_enum" AS ENUM (
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "price" numeric(12,2) NOT NULL DEFAULT 0,
        "imageUrl" character varying,
        "imageKitId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "address" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        "quantity" integer NOT NULL DEFAULT 1,
        "status" "orders_status_enum" NOT NULL DEFAULT 'pending',
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_orders_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_orders_customerId" ON "orders" ("customerId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_productId" ON "orders" ("productId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_orders_productId"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_customerId"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "orders_status_enum"`);
  }
}
