import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketID(userID){
    return userSocketMap[userID];
}

//map: userID -> socketID
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("User with the following socket-ID connected: ", socket.id);

    const userID = socket.handshake.query.userID;
    if(userID) userSocketMap[userID] = socket.id;

    //io.emit() sends to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User with the following socket-ID disconnected: ", socket.id);
        delete userSocketMap[userID];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { io, app, server}