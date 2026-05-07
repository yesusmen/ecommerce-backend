import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName: string = "";

    @Column()
    lastName: string = "";

    @Column({ unique: true })
    email: string = "";

    @Column({ unique: true })
    phone: string = "";

    @Column({ nullable: true })
    image: string = "";

    @Column({ nullable: true })
    notification_token: string = "";

    @Column()
    password: string = "";

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date = new Date();

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date = new Date();

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    }


}