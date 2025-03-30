import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTrackingDbChanges1743367380664 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS db_changes_history (
                id INT PRIMARY KEY AUTO_INCREMENT,
                \`sql\` LONGTEXT NOT NULL,
                \`timestamp\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS db_changes_history');
    }
}