import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractBranch1739150000000 implements MigrationInterface {
  name = 'ContractBranch1739150000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contracts"
        ADD COLUMN IF NOT EXISTS "branch" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN IF EXISTS "branch"`);
  }
}
