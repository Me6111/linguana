import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameValueColumnToNoun1740783630806 implements MigrationInterface {
    name = 'RenameValueColumnToNoun1740783630806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nouns\` CHANGE \`name\` \`noun\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`nouns\` DROP COLUMN \`noun\``);
        await queryRunner.query(`ALTER TABLE \`nouns\` ADD \`noun\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nouns\` DROP COLUMN \`noun\``);
        await queryRunner.query(`ALTER TABLE \`nouns\` ADD \`noun\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`nouns\` CHANGE \`noun\` \`name\` varchar(255) NOT NULL`);
    }

}
