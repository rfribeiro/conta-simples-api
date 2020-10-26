require('dotenv').config({ path: __dirname+'/.env' });
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import Enterprise from './Enterprise';
import Transaction from './Transaction';

@Entity('cards')
class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column()
    number: string;

    @Column({ default: 0 })
    balance: number;

    @ManyToOne(type => Enterprise)
    @JoinColumn({name: 'enterprise_id'})
    enterprise: Enterprise;

    @OneToMany(type => Transaction, transaction => transaction.card)
    transactions: Transaction[];

    final() {
        return this.number.substr(this.number.length - Number(process.env.CARD_FINAL_LENGHT))
    }
}

export default Card;