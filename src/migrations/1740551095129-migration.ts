import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740551095129 implements MigrationInterface {
    name = 'Migration1740551095129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_set" ALTER COLUMN "releaseDate" SET DEFAULT '2000-01-01'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_set" ALTER COLUMN "releaseDate" SET DEFAULT '2000-01-01 00:00:00'`);
    }

}
