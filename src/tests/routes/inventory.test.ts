import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import { mockInventory } from "../mocks/mockData";

let inventory: any;

describe("inventory Routes", () => {
    it("should create an inventory successfully", async () => {
        const res = await makeRequest(
            "post",
            "/api/v1/inventory",
            mockInventory
        );
        inventory = res?.body?.data;
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should update an inventory successfully", async () => {
        const res = await makeRequest(
            "put",
            `/api/v1/inventory/${inventory.id}`,
            mockInventory
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should fetch all inventories and return success", async () => {
        const res = await makeRequest("get", "/api/v1/inventory");

        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should fetch inventory by ID and return success", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/inventory/${inventory.id}`
        );

        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should delete an inventory successfully", async () => {
        const res = await makeRequest(
            "delete",
            `/api/v1/inventory/${inventory.id}`
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    // Edge cases
    it("should return inventory not found", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/inventory/${inventory.id}`
        );
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
    });

    it("should return invalid fields error while creating inventory", async () => {
        const emptyInventory = { name: "sample inventory" };
        const res = await makeRequest(
            "post",
            "/api/v1/inventory",
            emptyInventory
        );
        expect(res.status).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });
});
