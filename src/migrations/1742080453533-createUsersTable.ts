import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1742080074411 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`Users\` (
                \`user_id\` VARCHAR(255) NOT NULL,
                PRIMARY KEY (\`user_id\`)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`Users\`
        `);
    }
}