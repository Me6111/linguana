import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNounsTable1740778824222 implements MigrationInterface {
    name = 'CreateNounsTable1740778824222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`noun\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`noun\``);
    }

}
