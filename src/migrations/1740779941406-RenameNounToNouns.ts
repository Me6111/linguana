import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNounToNouns1740779941406 implements MigrationInterface {
    name = 'RenameNounToNouns1740779941406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nouns\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`nouns\``);
    }

}
