import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCardsTable1603332987538 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
        name: "cards",
        columns: [
            {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
            },
            {
                name: 'number',
                type: 'varchar',
                isUnique: true,              
            },
            {
                name: 'enterprise_id',
                type: 'uuid',
            },
        ],
        foreignKeys: [
            {
                name: 'CardEnterprise',
                columnNames: ['enterprise_id'],
                referencedTableName: 'enterprises',
                referencedColumnNames: ['id'],
            }
        ]
    }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cards')
    }

}
