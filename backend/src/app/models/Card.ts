import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('cards')
class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column()
    number: number;
}

export default Card;