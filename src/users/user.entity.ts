import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcryptjs';
import { Rol } from "src/roles/role.entity";

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

    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }   
    })
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[];

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    }


}