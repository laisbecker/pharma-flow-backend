import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";

export class CreateTableAddDriverToMovements1741136107853 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("movements", new TableColumn({
            name: "driver_id",
            type: "int",
            isNullable: true
        }))

        await queryRunner.createForeignKey("movements", new TableForeignKey({
            columnNames: ["driver_id"],
            referencedTableName: "drivers",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("movements")

        if (table) {
            const foreignKey = table.foreignKeys.find(fk =>
                fk.columnNames.some(c => c === "driver_id")
            );

            if (foreignKey) {
                await queryRunner.dropForeignKey("movements", foreignKey);
            }
        }
        try {
            await queryRunner.dropColumn("movements", "driver_id")
        } catch (error) {
            console.log('Aviso: Coluna driver_id não encontrada')
        }
    }
}
