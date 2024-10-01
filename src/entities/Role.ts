// src/entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity("role")
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    role_name: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
