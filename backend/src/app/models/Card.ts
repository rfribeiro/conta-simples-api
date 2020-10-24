import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import Enterprise from './Enterprise';

@Entity('cards')
class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column()
    number: string;

    @ManyToOne(type => Enterprise)
    @JoinColumn({name: 'enterprise_id'})
    enterprise: Enterprise;
}

export default Card;