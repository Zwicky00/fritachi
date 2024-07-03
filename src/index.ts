import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import mongoose from "mongoose";
import log from "./utils/logger";
import deserializeUser from "./middleware/deserializeUser";
import {
  addChatRequest,
  addChatSerializer,
} from "./serializers/chatSerializer";
import { ChatDocument } from "./models/chatModel";
import { Socket, Server as SocketIOServer } from "socket.io";
import { get } from "lodash";
import { verifyJwt } from "./utils/jwtUtils";
import { extractUserInfo, handleMessage } from "./service/socketService";
import { CHAT_TYPE } from "./constants";
import Community from "./models/communityModel";

dotenv.config();
const app = express();
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const io = new SocketIOServer(server);
const clients = new Map<string, string>();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(deserializeUser);

const MONGO_URL = process.env.MONGO_URL as string;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    log.info("Database sucessfully connected");
  })
  .catch((error) => {
    log.error(error, "Failed to connect to the database");
  });

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Use routes
app.use("/api", routes);

io.on("connection", (socket: Socket) => {
  const userInfo = extractUserInfo(socket.handshake.headers.cookie);
  if (userInfo !== null && typeof userInfo !== "string") {
    clients.set(userInfo._id, socket.id);
  } else {
    socket.send("error", "Authorization Failed");
  }
  socket.on("message", async (message: any) => {
    try {
      const response = await handleMessage(message);

      console.log(response.newMessage);
      const receiverKind = response.savedChat?.kind;
      if (receiverKind === CHAT_TYPE.USER) {
        response.savedChat?.members.map((member) => {
          const receiverId = member.toString();
          if (clients.has(receiverId)) {
            const receiverSocket = clients.get(receiverId) as string;
            io.to(receiverSocket).emit("receive", response.newMessage);
          }
        });
      } else if (receiverKind === CHAT_TYPE.COMMUNITY) {
        const communityId = response.savedChat?.community;
        const community = await Community.findById(communityId);
        community?.memberList.map((element) => {
          const receiverId = element.member.toString();
          if (clients.has(receiverId)) {
            const receiverSocket = clients.get(receiverId) as string;
            io.to(receiverSocket).emit("receive", response.newMessage);
          }
        });
      }
    } catch (error) {
      const response = {
        error: "Could not send the chat",
      };
      socket.send(response.toString());
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
