import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import { fakeIDs, mockInventory } from "../mocks/mockData";
import {
    generateRandomUserData,
    generateTaskData,
} from "../utils/generateMockData";

let notification: any;
let user: any;
let task: any;
let token: string;

describe("notification Routes", () => {
    // Creating user
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

        // Create a sample task just for creating a notification
        const mockTask = generateTaskData("general", user.id);
        const res = await makeRequest("post", "/api/v1/tasks", mockTask);
        task = res.body?.data;
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Task created");
    });

    it("should fetch all notifications and return success", async () => {
        const res = await makeRequest("get", "/api/v1/notification", "", token);
        notification = res.body?.data;
        console.log("notifications", res.body);
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should mark notification as read", async () => {
        const res = await makeRequest(
            "patch",
            `/api/v1/notification/${notification[0].id}`,
            "",
            token
        );
        expect(res.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should mark all notifications as read", async () => {
        const res = await makeRequest(
            "patch",
            `/api/v1/notification/readAll`,
            "",
            token
        );
        expect(res.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should delete a notification successfully", async () => {
        const res = await makeRequest(
            "delete",
            `/api/v1/notification/${notification[0].id}`,
            "",
            token
        );
        expect(res.status).toBe(httpStatus.NO_CONTENT);
    });

    // Edge cases
    it("should return notification not found", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/notification/${fakeIDs[0]}`,
            "",
            token
        );
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
    });
});
