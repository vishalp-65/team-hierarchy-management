import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import {
    generateRandomUserData,
    generateTaskData,
} from "../utils/generateMockData";
import { user } from "./admin.test";
import { fakeIDs } from "../mocks/mockData";

let task: any;
let boUser: any;
let token: string;

describe("Task Routes", () => {
    // Creating user
    beforeAll(async () => {
        const randomUser = generateRandomUserData(["BO"]);
        const userRes = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUser
        );
        boUser = userRes?.body?.data?.user;
        token = userRes?.body?.data?.token;
        expect(userRes.status).toBe(httpStatus.CREATED);
        expect(userRes.body.success).toBe(true);
    });

    it("should create a task successfully", async () => {
        const mockTask = generateTaskData("general", user.id);
        const res = await makeRequest("post", "/api/v1/tasks", mockTask);
        task = res.body?.data;
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Task created");
    });

    it("should update a task successfully", async () => {
        const updatedTask = { title: "task updated" };
        const res = await makeRequest(
            "patch",
            `/api/v1/tasks/${task.id}`,
            updatedTask
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Task updated");
    });

    it("should fetch tasks by filter and return success", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/tasks?sortBy=status&assignedTo=${task.assignee.id}&taskType=your&dueDatePassed=0&order=asc`
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("All tasks");
    });

    it("should added a comment successfully", async () => {
        const mockComment = { content: "This is sample comment" };
        const res = await makeRequest(
            "post",
            `/api/v1/tasks/${task.id}/comments`,
            mockComment
        );
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Comment added to task");
    });

    it("should return a comment successfully", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/tasks/comment?taskId=${task?.id}`
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Comments fetched successfully");
    });

    it("should update the status of task", async () => {
        const mockStatus = { status: "in-progress" };
        const res = await makeRequest(
            "patch",
            `/api/v1/tasks/${task.id}/status`,
            mockStatus
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Task status updated");
    });

    // Edge case for unauthorized user
    it("should return unauthorized access for other user", async () => {
        const updatedTask = { title: "task updated" };
        const res = await makeRequest(
            "patch",
            `/api/v1/tasks/${task.id}`,
            updatedTask,
            token
        );
        expect(res.status).toBe(httpStatus.FORBIDDEN);
        expect(res.body.success).toBe(false);
    });

    it("should delete a task successfully", async () => {
        const res = await makeRequest("delete", `/api/v1/tasks/${task.id}`);
        expect(res.status).toBe(httpStatus.NO_CONTENT);
    });

    // Edge cases
    it("return task not found when delete not exists task", async () => {
        const res = await makeRequest("delete", `/api/v1/tasks/${fakeIDs[0]}`);
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
    });

    it("should return bad request for Invalid Assignee", async () => {
        const mockTask = generateTaskData("general");
        const res = await makeRequest("post", "/api/v1/tasks", mockTask);

        expect(res.status).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("assigneeId Required");
    });
});
