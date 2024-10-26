import { Server, Socket } from "socket.io";
import {
    authenticateSocket,
    checkTaskPermissionsSocket,
} from "../middlewares/auth.middleware";
import {
    addCommentHandler,
    getCommentsHandler,
    notificationHandler,
} from "../sockets/socketHandler";
import { catchAsyncSocket } from "../utils/catchAsync";

export const initializeSocket = (server: any): Server => {
    const io = new Server(server, { cors: { origin: "*" } });

    // Use authentication middleware
    io.use((socket, next) => authenticateSocket(socket, next));

    io.on("connection", (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Add Comment Event with Permission Check
        socket.on("addComment", async (data) => {
            await checkTaskPermissionsSocket(socket, data.taskId, (err) => {
                if (err) return socket.emit("error", err.message);
                catchAsyncSocket(addCommentHandler(io, socket, data));
            });
        });

        // Get Comments Event
        socket.on("getComments", (data) =>
            catchAsyncSocket(getCommentsHandler(io, socket, data))
        );

        // Notification Handler for Specific User
        socket.on("getNotifications", () =>
            catchAsyncSocket(notificationHandler(socket))
        );

        // Handle Disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};
