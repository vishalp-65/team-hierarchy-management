// src/services/brandService.ts
import AppDataSource from "../data-source";
import { Brand } from "../entities/Brand";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

class BrandService {
    async createOrUpdateBrand(user: any, brandData: any) {
        const userRepo = AppDataSource.getRepository(User);
        const brandRepo = AppDataSource.getRepository(Brand);

        // // Fetch user and check if user has BO role
        // const user = await userRepo.findOneBy({ id: userId });

        // if (!user || !user.roles.some((role) => role.role_name === "BO")) {
        //     throw new ApiError(
        //         httpStatus.FORBIDDEN,
        //         "You are not authorized to manage brands"
        //     );
        // }

        // Find an existing brand by name, ensure it's not returning an array but a single brand
        let brand = await brandRepo.findOne({
            where: { brand_name: brandData.brand_name },
        });

        if (!brand) {
            // Create a new brand if it doesn't exist
            brand = brandRepo.create({
                brand_name: brandData.brand_name,
                revenue: brandData.revenue,
                deal_closed_value: brandData.deal_closed_value, // Added this field to match Zod schema
                contact_person_name: brandData.contact_person_name,
                contact_person_phone: brandData.contact_person_phone,
                contact_person_email: brandData.contact_person_email,
                owners: [user],
            });
        } else {
            // If brand exists, update it
            Object.assign(brand, {
                revenue: brandData.revenue,
                deal_closed_value: brandData.deal_closed_value,
                contact_person_name: brandData.contact_person_name,
                contact_person_phone: brandData.contact_person_phone,
                contact_person_email: brandData.contact_person_email,
            });
        }

        // Save the brand entity
        await brandRepo.save(brand);
        return brand;
    }

    async getBrandsOwnedByUser(userId: number) {
        const brandRepo = AppDataSource.getRepository(Brand);

        // Fetch all brands owned by the user
        const brands = await brandRepo.find({
            where: { owners: { id: userId } },
            relations: ["owners"],
        });

        return brands;
    }
}

export const brandService = new BrandService();
