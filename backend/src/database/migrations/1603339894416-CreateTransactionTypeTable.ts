import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransactionTypeTable1603339894416 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
            name: "transactionTypes",
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
                    name: 'type',
                    type: 'varchar',
                    isUnique: true,          
                },
                {
                    name: 'description',
                    type: 'varchar',
                },             
            ]
        }))        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactionTypes')
        // await queryRunner.query('DROP EXTENSION CASCADE "uuid-ossp"')   
    }


}
