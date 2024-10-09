import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

class TeamService {
    async getTeamHierarchy(userId: number) {
        const userRepo = AppDataSource.getRepository(User);

        // Fetch all users and their managers in a single query
        const allUsers = await userRepo.find({
            relations: ["team", "roles", "manager"], // Assuming "manager" is a relation that points to the user's manager
        });

        // Find the root user (team owner)
        const user = allUsers.find((user) => user.id === userId);

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "Team owner not found");
        }

        // Ensure the user has the "TO" role
        if (
            !user.roles ||
            !user.roles.some((role) => role.role_name === "TO")
        ) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "User is not a Team Owner"
            );
        }

        // Build a map of users grouped by their managerId
        const managerMap = new Map<number, User[]>();
        allUsers.forEach((user) => {
            if (user.manager && user.manager.id) {
                if (!managerMap.has(user.manager.id)) {
                    managerMap.set(user.manager.id, []);
                }
                managerMap.get(user.manager.id)?.push(user);
            }
        });

        // BFS approach using a queue to build the hierarchy
        const buildHierarchy = (rootUser: User) => {
            const queue = [rootUser];
            const hierarchy = { ...rootUser, hierarchy: [] };
            const userHierarchyMap = new Map<number, any>();
            userHierarchyMap.set(rootUser.id, hierarchy);

            while (queue.length > 0) {
                const currentUser = queue.shift();
                const currentHierarchy = userHierarchyMap.get(currentUser?.id!);

                // Get subordinates from the managerMap
                const subordinates = managerMap.get(currentUser?.id!) || [];

                // For each subordinate, add them to the hierarchy and queue
                subordinates.forEach((subordinate) => {
                    const subordinateHierarchy = {
                        ...subordinate,
                        hierarchy: [],
                    };
                    currentHierarchy.hierarchy.push(subordinateHierarchy);
                    queue.push(subordinate);
                    userHierarchyMap.set(subordinate.id, subordinateHierarchy);
                });
            }

            return hierarchy;
        };

        // Build the hierarchy tree starting from the root user
        const hierarchy = buildHierarchy(user);

        return {
            success: true,
            hierarchy,
        };
    }
}

export const teamService = new TeamService();
