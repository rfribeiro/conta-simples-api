import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransactionsTable1603339842798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
            name: "transactions",
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'value',
                    type: 'numeric',            
                },
                {
                    name: 'local',
                    type: 'varchar',
                },
                {
                    name: 'credit',
                    type: 'boolean',
                },          
            ]
        }))        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions')
        // await queryRunner.query('DROP EXTENSION CASCADE "uuid-ossp"')   
    }

}