import httpStatus from "http-status";
import AppDataSource from "../data-source";
import { Brand } from "../entities/Brand";
import { User } from "../entities/User";
import { ContactPerson } from "../entities/ContactPerson";
import { ApiError } from "../utils/ApiError";
import { brandTypes } from "../types/types";

class BrandService {
    async createBrand(user: any, brandData: brandTypes) {
        const brandRepo = AppDataSource.getRepository(Brand);
        const contactPersonRepo = AppDataSource.getRepository(ContactPerson);

        // Find an existing brand by name
        let brand = await brandRepo.findOne({
            where: { brand_name: brandData.brand_name },
            relations: ["owners", "contactPersons"],
        });

        if (brand) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Brand name already exists"
            );
        }

        if (!brand) {
            // Create a new brand if it doesn't exist
            brand = brandRepo.create({
                brand_name: brandData.brand_name,
                revenue: brandData.revenue,
                deal_closed_value: brandData.deal_closed_value,
                owners: [user],
            });
            // Save the brand entity first
            await brandRepo.save(brand);
        }

        // Add new contact persons
        const contactPersonEntities = contactPersonRepo.create({
            contact_person_name: brandData.contact_person_name,
            contact_person_phone: brandData.contact_person_phone,
            contact_person_email: brandData.contact_person_email,
            brand: brand,
        });

        // Save all contact persons
        await contactPersonRepo.save(contactPersonEntities);

        // Return the brand with updated contact persons
        const createdBrand = await brandRepo.findOne({
            where: { id: brand.id },
            relations: ["owners", "contactPersons"],
        });

        return createdBrand;
    }

    // Update brand
    async updateBrand(user: any, brandId: number, brandData: brandTypes) {
        const brandRepo = AppDataSource.getRepository(Brand);

        // Find the existing brand by its ID
        const brand = await brandRepo.findOne({
            where: { id: brandId },
            relations: ["owners", "contactPersons"],
        });

        if (!brand) {
            throw new ApiError(httpStatus.NOT_FOUND, "Brand not exists");
        }

        // Update only the required fields
        brand.brand_name = brandData.brand_name!;
        brand.revenue = brandData.revenue!;
        brand.deal_closed_value = brandData.deal_closed_value!;

        // Save the updated brand
        await brandRepo.save(brand);

        // Return the updated brand details
        const updatedBrand = await brandRepo.findOne({
            where: { id: brand.id },
            relations: ["owners", "contactPersons"],
        });

        return updatedBrand;
    }

    async getBrandsOwnedByUser(userId: number) {
        const brandRepo = AppDataSource.getRepository(Brand);

        // Fetch all brands owned by the user, including contact persons
        const brands = await brandRepo.find({
            where: { owners: { id: userId } },
            relations: ["owners", "contactPersons"],
        });

        return brands;
    }

    async getBrandDetails(userId: number, brandId: number) {
        const userRepo = AppDataSource.getRepository(User);
        const brandRepo = AppDataSource.getRepository(Brand);

        // Find user and their roles
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles"],
        });

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        // Check user roles
        const isBO = user.roles.some((role) => role.role_name === "BO");
        const isTO = user.roles.some((role) => role.role_name === "TO");
        const isPO = user.roles.some((role) => role.role_name === "PO");

        // Determine which relations to include based on user role
        const brandRelations = ["owners"];
        if (isBO || isPO) {
            brandRelations.push("contactPersons");
        }

        // Fetch the brand by ID
        const brand = await brandRepo.findOne({
            where: { id: brandId },
            relations: brandRelations,
        });

        if (!brand) {
            throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
        }

        // Check if user is a BO (Brand Owner)
        if (isBO) {
            return brand; // BO gets full access
        }

        // For TO or PO roles, check if they can access the brand
        if (isTO || isPO) {
            // Check if any of the brand owners are in the user's hierarchy
            let canAccess = false;
            for (const owner of brand.owners) {
                if (await this.isUserInHierarchy(user, owner.id)) {
                    canAccess = true;
                    break;
                }
            }

            if (!canAccess) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    "Access denied to brand details"
                );
            }

            if (!isPO) {
                // Remove contactPersons data if the user is not PO
                delete brand.contactPersons;
            }

            return brand;
        }

        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You don't have access to this brand"
        );
    }

    // Helper function to check if targetUserId is in requester's hierarchy
    async isUserInHierarchy(
        requester: User,
        targetUserId: number
    ): Promise<boolean> {
        const userRepo = AppDataSource.getRepository(User);

        // Use an iterative approach with a queue
        let queue = [requester];

        while (queue.length > 0) {
            const currentUser = queue.shift();

            if (currentUser?.id === targetUserId) {
                return true;
            }

            // Fetch direct subordinates of currentUser
            const subordinates = await userRepo.find({
                where: { manager: { id: currentUser?.id } },
            });

            queue = queue.concat(subordinates);
        }

        return false;
    }
}

export const brandService = new BrandService();
