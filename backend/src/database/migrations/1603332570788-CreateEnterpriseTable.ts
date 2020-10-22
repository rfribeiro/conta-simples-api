import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateEnterpriseTable1603332570788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
            name: "enterprises",
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isUnique: false,
                },
                {
                    name: 'cnpj',
                    type: 'varchar',
                    isUnique: true,
                },
            ]
        }))        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
