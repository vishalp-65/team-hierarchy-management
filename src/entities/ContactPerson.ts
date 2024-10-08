import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Brand } from "./Brand";

@Entity("contact_persons")
export class ContactPerson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    contact_person_name: string;

    @Column()
    contact_person_phone: string;

    @Column()
    contact_person_email: string;

    @ManyToOne(() => Brand, (brand) => brand.contactPersons)
    brand: Brand;
}
