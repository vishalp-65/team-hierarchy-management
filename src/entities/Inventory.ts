import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { inventoryStatus } from "../constant/enums";

@Entity("inventory")
export class Inventory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "int", default: 0 })
    quantity: number;

    @Column({
        type: "enum",
        enum: inventoryStatus,
        default: "available",
    })
    status: string;

    @OneToMany(() => Task, (task) => task.inventory)
    tasks: Task[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
