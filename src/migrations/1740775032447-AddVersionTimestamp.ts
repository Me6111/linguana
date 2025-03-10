import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyColumns1707775032447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("adjectives", [
            new TableColumn({
                name: "updatedAt",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
                isNullable: true,
            }),
            new TableColumn({
                name: "version",
                type: "int",
                default: "1",
                isNullable: true,
            }),
        ]);

        await queryRunner.addColumns("nouns", [
            new TableColumn({
                name: "updatedAt",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
                isNullable: true,
            }),
            new TableColumn({
                name: "version",
                type: "int",
                default: "1",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("adjectives", "updatedAt");
        await queryRunner.dropColumn("adjectives", "version");
        await queryRunner.dropColumn("nouns", "updatedAt");
        await queryRunner.dropColumn("nouns", "version");
    }
}