// src/entities/Task.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Brand } from "./Brand";
import { TaskHistory } from "./TaskHistory";
import { Comment } from "./Comment";
import { taskStatus, taskType } from "../constant/enums";
import { Inventory } from "./Inventory";
import { Event } from "./Event";
import { Notification } from "./Notification";

@Entity("tasks")
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({
        type: "enum",
        enum: taskType,
    })
    task_type: string;

    @Column({ type: "date", nullable: true })
    due_date: Date;

    @ManyToOne(() => User, (user) => user.tasksCreated)
    creator: User;

    @ManyToOne(() => User, (user) => user.tasksAssigned)
    assignee: User;

    @ManyToOne(() => Brand, { nullable: true })
    brand: Brand;

    @ManyToOne(() => Event, { nullable: true })
    event: Event;

    @ManyToOne(() => Inventory, { nullable: true })
    inventory: Inventory;

    @Column({
        type: "enum",
        enum: taskStatus,
        default: "open",
    })
    status: string;

    @OneToMany(() => TaskHistory, (history) => history.task, { cascade: true })
    history: TaskHistory[];

    @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
    comments: Comment[];

    @OneToMany(() => Notification, (notification) => notification.task, {
        cascade: true,
    })
    notifications: Notification[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    task: globalThis.Event;
}
