import { BeforeInsert, Column, CreateDateColumn, Entity, getRepository, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import BankAccount from './BankAccount'
import User from './User';
import Transaction from './Transaction'

@Entity('enterprises')
class Enterprise {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column()
    name: string;

    @Column()
    cnpj: string;

    @Column({ default: 0 })
    balance: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(type => BankAccount, bank => bank.enterprise, {
        cascade: ['insert', 'update']
    })
    bankAccount: BankAccount;

    @OneToOne(type => User, user => user.enterprise)
    @JoinColumn({name: 'user_id'})
    user: User;

    @OneToMany(type => Transaction, transaction => transaction.enterprise)
    transactions: Transaction[];
}

export default Enterprise;