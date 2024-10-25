// src/entities/User.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Team } from "./Team";
import { Role } from "./Role";
import { Brand } from "./Brand";
import { Task } from "./Task";
import { Comment } from "./Comment";
import { Notification } from "./Notification";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 45 })
    user_name: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 15 })
    phone_number: string;

    @Column({ length: 100, unique: true })
    email: string;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable({
        name: "users_role",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
    })
    roles: Role[];

    // For checking default password
    @Column({ default: true })
    isDefaultPassword: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Team, (team) => team.members)
    team: Team;

    @OneToMany(() => Team, (team) => team.teamOwner)
    teamsManaged: Team[];

    @ManyToMany(() => Brand, (brand) => brand.owners)
    brands: Brand[];

    // Parent-child relationship
    @ManyToOne(() => User, (user) => user.children)
    manager: User; // This is the "parent"

    @OneToMany(() => User, (user) => user.manager)
    children: User[]; // These are the "children"

    // Task Relations
    @OneToMany(() => Task, (task) => task.creator)
    tasksCreated: Task[];

    @OneToMany(() => Task, (task) => task.assignee)
    tasksAssigned: Task[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];
}
