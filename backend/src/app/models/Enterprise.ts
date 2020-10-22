import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('enterprises')
class Enterprise {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column()
    name: string;

    @Column()
    cnpj: string;

    @CreateDateColumn()
    createdAt: Date;
}

export default Enterprise;