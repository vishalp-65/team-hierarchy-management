import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import {
    generateCacheKey,
    getFromCache,
    setCache,
} from "../utils/cacheHandler";

class UserService {
    async listTeammates(userId: string) {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["team", "team.members"],
        });

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        if (!user.team) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                "No team found for this user"
            );
        }

        return user.team.members;
    }

    async searchUser(searchTerm: string, userId: string) {
        // Validate cache
        const cacheKey = generateCacheKey("userSearch", userId, { searchTerm });

        // Check cache
        let userCache = await getFromCache<User>(cacheKey);
        if (userCache) return userCache;

        const userRepo = AppDataSource.getRepository(User);

        // Search by name, email and phone_number
        const users = await userRepo
            .createQueryBuilder("user")
            .where("user.user_name LIKE :searchTerm", {
                searchTerm: `%${searchTerm}%`,
            })
            .orWhere("user.email LIKE :searchTerm", {
                searchTerm: `%${searchTerm}%`,
            })
            .orWhere("user.phone_number LIKE :searchTerm", {
                searchTerm: `%${searchTerm}%`,
            })
            .getMany();

        // Cache the result
        await setCache(cacheKey, users);

        return users;
    }

    async getAllUsers(
        options: { page?: number; limit?: number } = {},
        userId: string
    ) {
        const { page = 1, limit = 10 } = options;

        // Generate a unique cache key based on user ID and filters
        const cacheKey = generateCacheKey("users", userId, {
            page,
            limit,
        });

        // Check if users are in cache
        const cachedUsers = await getFromCache<User[]>(cacheKey);
        if (cachedUsers) {
            return cachedUsers; // Return cached result if exists
        }

        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find({
            skip: (page - 1) * limit,
            take: limit,
        });

        // set cache for users
        await setCache(cacheKey, users);

        return users;
    }

    async getTeamAndBrandUsers(userId: string) {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["team", "brands", "team.members"],
        });

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        const teamMembers = user.team ? user.team.members : [];
        const brandOwners = user.brands
            ? user.brands.map((brand) => brand.owners).flat()
            : [];

        const uniqueUsers = new Set([...teamMembers, ...brandOwners]);

        return Array.from(uniqueUsers);
    }
}

export const userService = new UserService();
