import { User } from "src/users/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity({ name: 'roles' })
export class Rol {

    @PrimaryColumn()
    id: string = "";

    @Column()
    name: string = "";

    @Column()
    image: string = "";

    @Column()
    route: string = "";

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date = new Date();

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date = new Date();

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];


}