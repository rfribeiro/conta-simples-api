import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsersTable1603332120166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'mobile',
                    type: 'varchar',
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'passwordResetToken',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'passwordResetExpires',
                    type: 'timestamp',
                    isNullable: true,
                },
            ]
        }))        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
        // await queryRunner.query('DROP EXTENSION CASCADE "uuid-ossp"')        
    }
    

}
