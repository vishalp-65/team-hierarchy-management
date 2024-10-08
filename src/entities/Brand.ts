import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { ContactPerson } from "./ContactPerson";

@Entity("brand")
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    brand_name: string;

    @Column("decimal")
    revenue: number;

    @Column("decimal")
    deal_closed_value: number;

    @OneToMany(() => ContactPerson, (contactPerson) => contactPerson.brand)
    contactPersons: ContactPerson[];

    @ManyToMany(() => User, (user) => user.brands)
    @JoinTable({
        name: "brand_owners",
        joinColumn: { name: "brand_id" },
        inverseJoinColumn: { name: "user_id" },
    })
    owners: User[];
}
