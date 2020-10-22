import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateBankAccoutTable1603339783325 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
            name: "bankaccounts",
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true, 
                    generationStrategy: 'increment',
                },
                {
                    name: 'agency',
                    type: 'int',
                },
                {
                    name: 'digit',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'balance',
                    type: 'numeric',
                    default: 0,
                },                
                {
                    name: 'bankNumber',
                    type: 'int',
                },
                {
                    name: 'bankName',
                    type: 'varchar',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'enterprise_id',
                    type: 'uuid',
                },
            ],
            foreignKeys: [
                {
                    name: 'BankAccountEnterprise',
                    columnNames: ['enterprise_id'],
                    referencedTableName: 'enterprises',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                }
            ]
        }))        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('enterprises')
        // await queryRunner.query('DROP EXTENSION CASCADE "uuid-ossp"')   
    }

}
