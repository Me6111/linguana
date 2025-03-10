import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdjectivesTable1740776624307 implements MigrationInterface {
    name = 'CreateAdjectivesTable1740776624307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`adjectives\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`adjectives\``);
    }

}
