import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";

@Entity("brand")
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    brand_name: string;

    @Column("decimal")
    revenue: number;

    @Column("decimal")
    deal_closed_value: number;

    @Column({ length: 50 })
    contact_person_name: string;

    @Column({ length: 15 })
    contact_person_phone: string;

    @Column({ length: 100 })
    contact_person_email: string;

    @ManyToMany(() => User, (user) => user.brands)
    @JoinTable({
        name: "brand_owners",
        joinColumn: { name: "brand_id" },
        inverseJoinColumn: { name: "user_id" },
    })
    owners: User[];
}
