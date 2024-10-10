// src/tests/brand.test.ts
import request from "supertest";
import httpStatus from "http-status";
import { mockBrand } from "./mockData";
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
    authToken = 2; // Assume we got a token, decoded as userId with BO access
});

afterEach(async () => {
    await rollbackTransaction(queryRunner); // Rollback after each test
});

afterAll(async () => {
    await queryRunner.release(); // Release query runner after all tests
});

describe("Brand Routes", () => {
    describe("POST /api/v1/brand/create", () => {
        it("should create a brand and return 201", async () => {
            const response = await request(app)
                .post("/api/v1/brand/create")
                .set("Authorization", `Bearer ${authToken}`) // Include the token
                .send(mockBrand[0]);

            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body.success).toBe(true);
        });
    });

    describe("GET /api/v1/brand/:id", () => {
        it("should return brand details of given brand ID", async () => {
            const response = await request(app)
                .get("/api/v1/brand/1")
                .set("Authorization", `Bearer ${authToken}`); // Include the token

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
        });
    });

    describe("GET /api/v1/brand", () => {
        it("should return all brands of BO", async () => {
            const response = await request(app)
                .get("/api/v1/brand")
                .set("Authorization", `Bearer ${authToken}`); // Include the token

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
        });
    });
});
