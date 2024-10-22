import request from "supertest";
import app from "../..";
import AppDataSource from "../../data-source";
import { seedAdminUser } from "../../seeds/roles.seed";

let token: string;

// Ensure the DataSource is initialized before all tests
beforeAll(async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize().then(async () => {
                token = await seedAdminUser();
            });
        }
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        throw error;
    }
});

// Clean up and destroy the DataSource connection after all tests
afterAll(async () => {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    } catch (error) {
        console.error("Error during Data Source destruction:", error);
        throw error;
    }
});

// Function to make requests in the tests
export const makeRequest = async (
    method: string,
    endpoint: string,
    data?: any,
    loggedInUser: string = token
) => {
    switch (method.toLowerCase()) {
        case "get":
            return request(app)
                .get(endpoint)
                .set("Authorization", `Bearer ${loggedInUser}`);
        case "post":
            return request(app)
                .post(endpoint)
                .set("Authorization", `Bearer ${loggedInUser}`)
                .send(data);
        case "put":
            return request(app)
                .put(endpoint)
                .set("Authorization", `Bearer ${loggedInUser}`)
                .send(data);
        case "patch":
            return request(app)
                .patch(endpoint)
                .set("Authorization", `Bearer ${loggedInUser}`)
                .send(data);
        case "delete":
            return request(app)
                .delete(endpoint)
                .set("Authorization", `Bearer ${loggedInUser}`);
        default:
            throw new Error("Invalid method");
    }
};
