// src/entities/TaskHistory.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("task_history")
export class TaskHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Task, (task) => task.history)
    task: Task;

    @Column({ length: 50 })
    action: string; // e.g., 'created', 'assigned', 'status_changed', 'comment_added'

    @ManyToOne(() => User)
    performed_by: User;

    @CreateDateColumn()
    timestamp: Date;
}
