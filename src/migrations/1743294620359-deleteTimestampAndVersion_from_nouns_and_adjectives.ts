import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteTimestampAndVersionFromNounsAndAdjectives1743294620359 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop columns without IF EXISTS due to MySQL version incompatibility
        await queryRunner.query(`ALTER TABLE nouns DROP COLUMN updatedAt`);
        await queryRunner.query(`ALTER TABLE nouns DROP COLUMN version`);
        await queryRunner.query(`ALTER TABLE adjectives DROP COLUMN updatedAt`);
        await queryRunner.query(`ALTER TABLE adjectives DROP COLUMN version`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE nouns ADD COLUMN updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE nouns ADD COLUMN version INT NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE adjectives ADD COLUMN updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE adjectives ADD COLUMN version INT NOT NULL DEFAULT 1`);
    }
}