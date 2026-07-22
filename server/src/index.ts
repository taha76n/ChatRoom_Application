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

    io.emit("userList", Array.from(users.values()));

    io.emit("user_joined", userName);

    io.emit("message_history", messages)

  })

  socket.on("send_message", (message: string) => {

    const user = users.get(socket.id)
    if (user) {
      const msg: Message = {
        user,
        message,
        timeStamps: new Date()
      }

      messages.push(msg)
      io.emit("new_message", msg)
      
    }

  })

  socket.on("Disconnected", () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.userName} left the chat`)
      users.delete(socket.id);
      io.emit("userList", Array.from(users.values()));
      io.emit("user_left", user.userName);
      
    }

  })

})

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  
})

