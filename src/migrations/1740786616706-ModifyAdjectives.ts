import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyAdjectives1740786616706 implements MigrationInterface {
    name = 'ModifyAdjectives1740786616706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`en\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`es\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`sense\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`sense of\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`feature of\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`positive\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`negative\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`definition\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`examples of phrases\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`examples of phrases\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`definition\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`negative\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`positive\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`feature of\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` DROP COLUMN \`sense of\``);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`sense\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`es\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`adjectives\` ADD \`en\` varchar(255) NOT NULL`);
    }

}
