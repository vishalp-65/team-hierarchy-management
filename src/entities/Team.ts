import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";

@Entity("team")
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.teamsManaged, { onDelete: "CASCADE" })
    teamOwner: User;

    @OneToMany(() => User, (user) => user.team)
    members: User[];
}
