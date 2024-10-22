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
        const cacheKey = generateCacheKey("users", userId, {});

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
        await setCache(cacheKey, users, 3600); // Cache for 1 hour

        return users;
    }
}

export const userService = new UserService();
