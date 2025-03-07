import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyAdjectives1740784647905 implements MigrationInterface {
    name = 'ModifyAdjectives1740784647905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`value\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`sense\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`en\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`es\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`es\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`en\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`sense\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`value\` varchar(255) NOT NULL`);
    }

}
