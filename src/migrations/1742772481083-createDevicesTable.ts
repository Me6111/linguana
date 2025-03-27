import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDevicesTable1742772481083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE Devices (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                device_id VARCHAR(255) UNIQUE,
                device_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE Devices;
        `);
    }
}