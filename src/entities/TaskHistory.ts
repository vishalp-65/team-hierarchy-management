// src/entities/TaskHistory.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("task_history")
export class TaskHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Task, (task) => task.history, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "taskId" }) // Explicitly define the foreign key
    task: Task;

    @Column({ length: 50 })
    action: string; // e.g., 'created', 'assigned', 'status_changed', 'comment_added'

    @ManyToOne(() => User)
    @JoinColumn({ name: "performedById" })
    performed_by: User;

    @CreateDateColumn()
    timestamp: Date;
}
