import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import bcrypt from 'bcryptjs'
import PasswordHelper from '../utils/PasswordHelper';
import Enterprise from './Enterprise';

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

    @BeforeInsert()
    hashPassword() {
        this.password = PasswordHelper.hash(this.password)
    }

    @OneToOne(type => Enterprise, enterprise => enterprise.user)
    enterprise: Enterprise;
}

export default User;