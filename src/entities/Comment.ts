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

    @Column({ type: "text", nullable: true }) // File path is optional
    file_path: string;

    @ManyToOne(() => Task, (task) => task.comments, {
        onDelete: "CASCADE",
    })
    task: Task;

    @ManyToOne(() => User, (user) => user.comments)
    author: User;

    @CreateDateColumn()
    created_at: Date;
}
