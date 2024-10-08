import httpStatus from "http-status";
import AppDataSource from "../data-source";
import { Brand } from "../entities/Brand";
import { ApiError } from "../utils/ApiError";
import { contactPerson } from "../types/types";
import { ContactPerson } from "../entities/ContactPerson";

class ContactPersonService {
    async createContact(brandId: number, contactData: contactPerson) {
        const brandRepo = AppDataSource.getRepository(Brand);
        const contactPersonRepo = AppDataSource.getRepository(ContactPerson);

        const brand = await brandRepo.findOne({
            where: { id: brandId },
            relations: ["owners", "contactPersons"],
        });

        if (!brand) {
            throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
        }

        // Create new contact person
        const contactPerson = contactPersonRepo.create({
            contact_person_name: contactData.contact_person_name,
            contact_person_phone: contactData.contact_person_phone,
            contact_person_email: contactData.contact_person_email,
            brand: brand,
        });

        // Save new contact person
        await contactPersonRepo.save(contactPerson);

        // Return the updated brand details
        const updatedBrand = await brandRepo.findOne({
            where: { id: brand.id },
            relations: ["owners", "contactPersons"],
        });

        return updatedBrand;
    }

    async updateContact(brandId: number, contactData: contactPerson) {
        const contactPersonRepo = AppDataSource.getRepository(ContactPerson);
        const brandRepo = AppDataSource.getRepository(Brand);

        const contactPerson = await contactPersonRepo.findOne({
            where: { brand: { id: brandId } },
        });

        if (!contactPerson) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                "Contact person not found"
            );
        }

        // Update contact details
        contactPerson.contact_person_name = contactData.contact_person_name;
        contactPerson.contact_person_phone = contactData.contact_person_phone;
        contactPerson.contact_person_email = contactData.contact_person_email;

        await contactPersonRepo.save(contactPerson);

        // Return the updated brand details
        const updatedBrand = await brandRepo.findOne({
            where: { id: brandId },
            relations: ["owners", "contactPersons"],
        });

        return updatedBrand;
    }
}

export const contactService = new ContactPersonService();
