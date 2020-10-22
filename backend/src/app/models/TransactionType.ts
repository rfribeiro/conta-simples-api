import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('transactionTypes')
class TransactionType {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    type: string;

    @Column()
    description: string;
}

export default TransactionType;