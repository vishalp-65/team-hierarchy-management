// src/entities/Notification.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity("notifications")
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.notifications)
    recipient: User;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => Task, (task) => task.notifications, {
        onDelete: "CASCADE",
    })
    task: Task;

    @Column({ default: false })
    is_read: boolean;

    @CreateDateColumn()
    created_at: Date;
}
