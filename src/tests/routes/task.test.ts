import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import { generateTaskData } from "../utils/generateUserData";
import { user } from "./admin.test";

let task: any;

describe("Task Routes", () => {
    it("should create a task successfully", async () => {
        const mockTask = generateTaskData("general", user.id);
        const res = await makeRequest("post", "/api/v1/tasks", mockTask);
        console.log("task created ", res.body);
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
        console.log("task updated ", res.body);
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

    it("should update the status of task", async () => {
        const mockStatus = { status: "in-progress" };
        const res = await makeRequest(
            "patch",
            `/api/v1/tasks/${task.id}/status`,
            mockStatus
        );
        console.log("task status ", res.body);
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Task status updated");
    });

    it("should delete a task successfully", async () => {
        const res = await makeRequest("delete", `/api/v1/tasks/${task.id}`);
        console.log("task deleted ", res.body);
        expect(res.status).toBe(httpStatus.NO_CONTENT);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Task deleted");
    });
});
