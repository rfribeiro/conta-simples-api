import { AfterInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import Enterprise from './Enterprise';

@Entity('bankaccounts')
class BankAccount {
    @PrimaryGeneratedColumn('increment')
    id: number ;

    @Column()
    agency: number;

    @Column()
    digit: number;

    @Column()
    balance: number;

    @Column()
    bankNumber: number;

    @Column()
    bankName: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Enterprise, enterprise => enterprise.bankAccount)
    @JoinColumn({ name: 'enterprise_id'})
    enterprise: Enterprise;

    @AfterInsert()
    updateDigit() {
        this.digit = this.id * 1
    }
}

export default BankAccount;