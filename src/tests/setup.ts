// src/tests/setup.ts
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";

let connection: DataSource;

beforeAll(async () => {
    connection = await AppDataSource.initialize();
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
