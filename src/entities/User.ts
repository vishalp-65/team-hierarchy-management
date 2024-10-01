import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Team } from "./Team";
import { Role } from "./Role";
import { Brand } from "./Brand";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    user_name: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 15 })
    phone_number: string;

    @Column({ length: 100 })
    email: string;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable({
        name: "users_role",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
    })
    roles: Role[];

    @ManyToOne(() => Team, (team) => team.members)
    team: Team;

    @OneToMany(() => Team, (team) => team.teamOwner)
    teamsManaged: Team[];

    @ManyToMany(() => Brand, (brand) => brand.owners)
    brands: Brand[];
}
