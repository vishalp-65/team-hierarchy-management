// src/tests/team.test.ts
import request from "supertest";
import httpStatus from "http-status";
import { QueryRunner } from "typeorm";
import app from "..";
import AppDataSource from "../data-source";
import { rollbackTransaction } from "./setup";
import { mockAssignRole } from "./mockData";

let queryRunner: QueryRunner;
let authToken: number;

beforeAll(async () => {
    queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    // Simulate login to obtain the token
    authToken = 1; // Assume we got a token, decoded as userId with ADMIN access
});

afterEach(async () => {
    await rollbackTransaction(queryRunner);
});

afterAll(async () => {
    await queryRunner.release();
});

describe("Team Routes", () => {
    describe("GET /api/v1/team", () => {
        it("should return team of current user", async () => {
            const response = await request(app)
                .get("/api/v1/team")
                .set("Authorization", `Bearer ${authToken}`); // Include the token

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
        });
    });
});
