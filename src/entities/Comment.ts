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

    @Column({ nullable: true })
    file_path: string; // Store the path to the file

    @Column({ nullable: true })
    file_type: string; // Store the file type (e.g., image/jpeg)

    @ManyToOne(() => Task, (task) => task.comments, {
        onDelete: "CASCADE",
    })
    task: Task;

    @ManyToOne(() => User, (user) => user.comments)
    author: User;

    @CreateDateColumn()
    created_at: Date;
}
