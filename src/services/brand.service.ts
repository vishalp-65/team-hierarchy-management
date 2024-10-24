import httpStatus from "http-status";
import AppDataSource from "../data-source";
import { Brand } from "../entities/Brand";
import { User } from "../entities/User";
import { ContactPerson } from "../entities/ContactPerson";
import { ApiError } from "../utils/ApiError";
import { brandTypes } from "../types/types";
import {
    clearCache,
    generateCacheKey,
    getFromCache,
    invalidateAllPrefixCache,
    setCache,
} from "../utils/cacheHandler";

class BrandService {
    async createBrand(user: User, brandData: brandTypes) {
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

        // Invalidate cache
        await invalidateAllPrefixCache("brands", user.id);

        return createdBrand;
    }

    // Update brand
    async updateBrand(user: any, brandId: string, brandData: brandTypes) {
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

        // Invalidate cache
        await invalidateAllPrefixCache("brand", brand.id);

        return updatedBrand;
    }

    async getBrandsOwnedByUser(userId: string) {
        // Validate cache
        const cacheKey = generateCacheKey("brand", userId, {});

        // Check cache
        let brandCache = await getFromCache<Brand>(cacheKey);
        if (brandCache) return brandCache;

        const brandRepo = AppDataSource.getRepository(Brand);

        // Fetch all brands owned by the user, including contact persons
        const brands = await brandRepo.find({
            where: { owners: { id: userId } },
            relations: ["owners", "contactPersons"],
        });

        // Cache the result
        await setCache(cacheKey, brands);

        return brands;
    }

    // Get all brands
    async getAllBrands(
        options: { page?: number; limit?: number } = {},
        userId: string
    ) {
        const { page = 1, limit = 10 } = options;

        // Generate a unique cache key based on user ID and filters
        const cacheKey = generateCacheKey("brands", userId, {
            page,
            limit,
        });

        // Check if brand are in cache
        const cachedBrands = await getFromCache<Brand[]>(cacheKey);
        if (cachedBrands) {
            return cachedBrands; // Return cached result if exists
        }
        const brandRepo = AppDataSource.getRepository(Brand);
        const brands = await brandRepo.find({
            relations: ["owners", "contactPersons"],
            skip: (page - 1) * limit,
            take: limit,
        });

        // set cache for brands
        await setCache(cacheKey, brands);

        return brands;
    }

    async getBrandDetails(userId: string, brandId: string) {
        // Validate cache
        const cacheKey = generateCacheKey("brand", brandId, {});

        // Check cache
        let brandCache = await getFromCache<Brand>(cacheKey);
        if (brandCache) return brandCache;

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
            // Cache the result
            await setCache(cacheKey, brand, 3600); // Cache for 1 hour

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

            // Cache the result
            await setCache(cacheKey, brand); // Cache for 1 hour

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
        targetUserId: string
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
