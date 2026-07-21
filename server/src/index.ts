import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { User, Message } from "./interfaces.ts";

const PORT = process.env.PORT;



const users = new Map<string, User>()

const messages: Message[] = []

const app = express();

app.use(cors());

const httpServer = createServer(app)


const io = new Server(httpServer, {
  cors: {
    origin: "https://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"]
  }
})

io.on("connection", (socket) => {
  console.log(`User connected to io with sockedId ${socket.id}`);
  
  socket.on("join_room", (userName: string) => {
    console.log(`User ${userName} has joined the room`);
    users.set(socket.id, {id: socket.id, userName: userName})

    io.emit("userList", Array.from(users.values()))

  })
  

})

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  
})

