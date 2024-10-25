import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import {
    generateBrandData,
    generateRandomUserData,
} from "../utils/generateMockData";
import { fakeIDs } from "../mocks/mockData";

let user: any;
let brand: any;
let token: string;

describe("Brand Routes", () => {
    // Creating user to access Brand route
    beforeAll(async () => {
        const randomUser = generateRandomUserData(["ADMIN", "BO"]);
        const userRes = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUser
        );
        user = userRes?.body?.data?.user;
        token = userRes?.body?.data?.token;

        expect(userRes.status).toBe(httpStatus.CREATED);
        expect(userRes.body.success).toBe(true);
    });

    it("should create an brand successfully", async () => {
        const brandData = generateBrandData([user.id]);
        const res = await makeRequest(
            "post",
            "/api/v1/brand/create",
            brandData,
            token
        );
        brand = res?.body?.data;
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should update the brand successfully", async () => {
        const updatedData = {
            brand_name: `${brand.brand_name} updated`,
        };
        const res = await makeRequest(
            "put",
            `/api/v1/brand/${brand.id}`,
            updatedData,
            token
        );
        console.log("brand details", res.body);
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Brand updated");
    });

    it("should create contact details and return success", async () => {
        const randomBrand = generateBrandData([user.id]);
        const res = await makeRequest(
            "post",
            `/api/v1/brand/contact/${brand.id}`,
            randomBrand,
            token
        );

        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should update contact details and return success", async () => {
        const randomBrand = generateBrandData([user.id]);
        const res = await makeRequest(
            "put",
            `/api/v1/brand/contact/${brand.id}`,
            randomBrand,
            token
        );

        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should fetch brand by ID and return success", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/brand/${brand.id}`,
            " ",
            token
        );

        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should fetch an brand successfully", async () => {
        const res = await makeRequest("get", `/api/v1/brand`, " ", user.id);
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    // Edge cases
    it("should return brand not found", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/brand/${fakeIDs[0]}`,
            "",
            token
        );
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
    });

    it("should return invalid fields error while creating brand", async () => {
        const emptyInventory = { name: "sample brand" };
        const res = await makeRequest(
            "post",
            "/api/v1/brand/create",
            emptyInventory,
            token
        );
        expect(res.status).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });
});
