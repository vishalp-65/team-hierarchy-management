// src/entities/Comment.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => Task, (task) => task.comments)
    task: Task;

    @ManyToOne(() => User, (user) => user.comments)
    author: User;

    @CreateDateColumn()
    created_at: Date;
}
