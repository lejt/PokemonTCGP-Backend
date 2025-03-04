import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741059760294 implements MigrationInterface {
    name = 'Migration1741059760294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card_set" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "logo" character varying NOT NULL DEFAULT '', "symbol" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "external_id" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL DEFAULT '2000-01-01', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fc8167449e2c751d0ca5fe48958" UNIQUE ("name"), CONSTRAINT "UQ_ff14a31ffd4304ec32fe1fd85d6" UNIQUE ("external_id"), CONSTRAINT "PK_d0a1f698623cc95750422e1aeae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "hp" integer NOT NULL DEFAULT '0', "types" text NOT NULL DEFAULT '[]', "stage" character varying NOT NULL DEFAULT '', "rarity" character varying NOT NULL, "suffix" character varying NOT NULL DEFAULT '', "attacks" json NOT NULL DEFAULT '[]', "retreat" integer NOT NULL DEFAULT '0', "weakness" json NOT NULL DEFAULT '[]', "category" character varying NOT NULL, "illustrator" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "external_id" character varying NOT NULL, "evolveFrom" character varying NOT NULL DEFAULT '', "effect" character varying NOT NULL DEFAULT '', "abilities" json NOT NULL DEFAULT '[]', "trainerType" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "card_set_id" integer, "pack_id" integer, CONSTRAINT "UQ_24bd1ab1eb187b6ad4339f119d5" UNIQUE ("external_id"), CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "card_id" integer, CONSTRAINT "PK_ca3ee74cc7245570761bc1c736c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_549eb4a507d092d4d3cfef79b2" ON "user_card" ("user_id", "card_id") `);
        await queryRunner.query(`ALTER TABLE "pack" ADD "image" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pack" ADD CONSTRAINT "FK_c560a0fcc907dfab22eea804e54" FOREIGN KEY ("cardSetId") REFERENCES "card_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_3a6cdccc7bb2189fd8af97ac971" FOREIGN KEY ("card_set_id") REFERENCES "card_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1" FOREIGN KEY ("pack_id") REFERENCES "pack"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_card" ADD CONSTRAINT "FK_d7fa5bc81ffc9708abd2d210c4a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_card" ADD CONSTRAINT "FK_2d154950ea2aae6f33f2dcdf8e1" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_card" DROP CONSTRAINT "FK_2d154950ea2aae6f33f2dcdf8e1"`);
        await queryRunner.query(`ALTER TABLE "user_card" DROP CONSTRAINT "FK_d7fa5bc81ffc9708abd2d210c4a"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_3a6cdccc7bb2189fd8af97ac971"`);
        await queryRunner.query(`ALTER TABLE "pack" DROP CONSTRAINT "FK_c560a0fcc907dfab22eea804e54"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pack" DROP COLUMN "image"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_549eb4a507d092d4d3cfef79b2"`);
        await queryRunner.query(`DROP TABLE "user_card"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "card_set"`);
    }

}
