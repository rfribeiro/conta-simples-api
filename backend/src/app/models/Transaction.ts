import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import Enterprise from './Enterprise';
import TransactionType from './TransactionType'

@Entity('transactions')
class Transaction {
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

    @ManyToOne(type => Enterprise, enterprise => enterprise.transactions)
    @JoinColumn({name: 'enterprise_id'})
    enterprise: Enterprise;
}

export default Transaction;