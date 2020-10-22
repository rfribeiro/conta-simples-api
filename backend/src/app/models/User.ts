import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import bcrypt from 'bcryptjs'
import PasswordHelper from '../utils/PasswordHelper';

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
}

export default User;