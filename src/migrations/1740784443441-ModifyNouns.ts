import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyNouns1740784443441 implements MigrationInterface {
    name = 'ModifyNouns1740784443441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nouns\` DROP COLUMN \`noun\``);
        await queryRunner.query(`ALTER TABLE \`nouns\` ADD \`sense\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`nouns\` ADD \`en\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`nouns\` ADD \`es\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nouns\` DROP COLUMN \`es\``);
        await queryRunner.query(`ALTER TABLE \`nouns\` DROP COLUMN \`en\``);
        await queryRunner.query(`ALTER TABLE \`nouns\` DROP COLUMN \`sense\``);
        await queryRunner.query(`ALTER TABLE \`nouns\` ADD \`noun\` varchar(255) NOT NULL`);
    }

}
