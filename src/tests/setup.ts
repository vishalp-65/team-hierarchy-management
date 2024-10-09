// src/tests/setup.ts
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import { deleteSchema } from "../seeds/roles.seed";
import { adminService } from "../services/admin.service";
import { mockUser } from "./mockData";
import { usersTypes } from "../types/types";

let connection: DataSource;

beforeAll(async () => {
    connection = await AppDataSource.initialize();
    if (connection.isInitialized) await deleteSchema();
    await adminService.createUser(mockUser[0] as usersTypes);
});

afterAll(async () => {
    if (connection.isInitialized) {
        await connection.destroy();
    }
});

export const rollbackTransaction = async (queryRunner: any) => {
    if (queryRunner && queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
    }
};
