// src/config/socketConfig.ts
import { Server, Socket } from "socket.io";
import {
    authenticateSocket,
    checkTaskPermissionsSocket,
} from "../middlewares/auth.middleware";
import {
    addCommentHandler,
    getCommentsHandler,
} from "../sockets/socketHandler";

export const initializeSocket = (server: any): Server => {
    const io = new Server(server, {
        cors: { origin: "*" },
    });

    // Use the authentication middleware for WebSocket connections
    io.use((socket, next) => authenticateSocket(socket, next));
    // io.use((socket, next) => checkTaskPermissionsSocket(socket, next));

    // Handle socket connection events
    io.on("connection", (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("addComment", (data) => addCommentHandler(io, socket, data));
        socket.on("getComments", (data) =>
            getCommentsHandler(io, socket, data)
        );

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};
