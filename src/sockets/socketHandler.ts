// src/sockets/socketHandlers.ts
import { Server, Socket } from "socket.io";
import { TaskServiceInstance } from "../services/task.service";
import { User } from "../entities/User";

// Add Comment Handler
export const addCommentHandler = async (
    io: Server,
    socket: Socket,
    data: { taskId: string; content: string; file?: any }
) => {
    try {
        const user = (socket as any).user as User; // Authenticated user from socket
        const comment = await TaskServiceInstance.addComment(
            data.taskId,
            data.content,
            user,
            data.file
        );

        // Emit the new comment to all users subscribed to the task
        io.to(data.taskId).emit("newComment", comment);
    } catch (error) {
        socket.emit("error", { message: "Failed to add comment", error });
    }
};

// Get Comments Handler
export const getCommentsHandler = async (
    io: Server,
    socket: Socket,
    data: { taskId: string; page: number; limit: number }
) => {
    try {
        const comments = await TaskServiceInstance.getComments(data);
        socket.emit("commentsList", comments);
    } catch (error) {
        socket.emit("error", { message: "Failed to retrieve comments", error });
    }
};
