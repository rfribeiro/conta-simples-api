import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import TransactionType from './TransactionType'

@Entity('transactions')
class Transactions {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    value: number;

    @Column()
    local: string;

    @Column()
    credit: boolean;

    @OneToOne(type => TransactionType)
    @JoinColumn({name: 'type_id'})
    type: TransactionType;
}

export default Transactions;