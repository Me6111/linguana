import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteNounTableBlank1740780649357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("noun");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add code to recreate the "noun" table if needed, otherwise leave empty.
    }

}