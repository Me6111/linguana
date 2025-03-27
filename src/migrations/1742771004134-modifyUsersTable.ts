import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUsersTable1742771004134 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove the existing primary key constraint from user_id if it exists
        try {
            await queryRunner.query(`ALTER TABLE Users DROP PRIMARY KEY;`);
        } catch (error) {
            // Ignore if no primary key exists.
        }

        // Add new columns first
        await queryRunner.query(`
            ALTER TABLE Users
            ADD COLUMN id INTEGER PRIMARY KEY AUTO_INCREMENT,
            ADD COLUMN email VARCHAR(255),
            ADD COLUMN phone_number VARCHAR(20);
        `);

        // Then drop the old column
        await queryRunner.query(`
            ALTER TABLE Users
            DROP COLUMN user_id;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Add the old column back
        await queryRunner.query(`
            ALTER TABLE Users
            ADD COLUMN user_id INTEGER;
        `);

        // Remove the new columns
        await queryRunner.query(`
            ALTER TABLE Users
            DROP COLUMN id,
            DROP COLUMN email,
            DROP COLUMN phone_number;
        `);

        // Add primary key back if it was there before.
        //This will need to be changed if the user_id was not a primary key before.
        await queryRunner.query(`ALTER TABLE Users ADD PRIMARY KEY (user_id);`);

    }
}