import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string ;

    @Column()
    email: string;

    @Column()
    mobile: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    passwordResetToken: string;
    
    @CreateDateColumn({nullable: true})
    passwordResetExpires: Date;
}

export default User;