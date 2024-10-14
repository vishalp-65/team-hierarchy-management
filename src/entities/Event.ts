import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Task } from "./Task";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "date", nullable: true })
    event_date: Date;

    @OneToMany(() => Task, (task) => task.event)
    tasks: Task[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
