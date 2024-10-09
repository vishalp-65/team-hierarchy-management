// src/tests/admin.test.ts
import request from "supertest";
import httpStatus from "http-status";
import { mockUser, mockBrand, mockAssignRole } from "./mockData";
import { QueryRunner } from "typeorm";
import app from "..";
import AppDataSource from "../data-source";
import { rollbackTransaction } from "./setup";

let queryRunner: QueryRunner;
let authToken: number;

beforeAll(async () => {
    queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    // Simulate login to obtain the token
    authToken = 1; // Assume we got a token, decode it as a userId (ADMIN access)
});

afterEach(async () => {
    await rollbackTransaction(queryRunner); // Ensure rollback after each test
});

afterAll(async () => {
    await queryRunner.release();
});
describe("Admin Routes", () => {
    describe("POST /api/v1/admin/user", () => {
        it("should create a user and return 201", async () => {
            const response = await request(app)
                .post("/api/v1/admin/user")
                .set("Authorization", `Bearer ${authToken}`) // Include the token
                .send(mockUser[1]);

            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body.success).toBe(true);
        });
    });

    describe("PUT /api/v1/admin/user/:id", () => {
        it("should update a user and return 200", async () => {
            const response = await request(app)
                .put("/api/v1/admin/user/2")
                .set("Authorization", `Bearer ${authToken}`) // Include the token
                .send({ ...mockUser[1], user_name: "Updated name" });

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
        });
    });

    describe("POST /api/v1/admin/brand", () => {
        it("should create a brand and return 201", async () => {
            const response = await request(app)
                .post("/api/v1/admin/brand")
                .set("Authorization", `Bearer ${authToken}`) // Include the token
                .send(mockBrand[0]);

            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body.success).toBe(true);
        });
    });

    describe("POST /api/v1/admin/assign-role", () => {
        it("should assign a role to a user and return 201", async () => {
            const response = await request(app)
                .post("/api/v1/admin/assign-role")
                .set("Authorization", `Bearer ${authToken}`) // Include the token
                .send(mockAssignRole[1]);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
        });
    });

    describe("GET /api/v1/admin/users/hierarchy/:userId", () => {
        it("should return a list of users in the TO hierarchy", async () => {
            const response = await request(app)
                .get("/api/v1/admin/users/hierarchy/2")
                .set("Authorization", `Bearer ${authToken}`); // Include the token
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toEqual(true);
        });
    });
});
