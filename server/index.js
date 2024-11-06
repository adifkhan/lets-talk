import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./helper/dbConfig.js";
import { Server } from "socket.io";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDb();
const app = express();

const allowedOrigins = ["https://lets-talk-rjff.onrender.com/", "http://localhost:3000"];

//------ middlewares --------//
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

//------------- routes ------------//
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notifiRoutes from "./routes/notifiRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import Notification from "./models/notificatonModel.js";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notifiRoutes);

//------------- Deployment -------------//

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to LET's TALK!");
  });
}

//------------- Deployment -------------//

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

//------------- Socket.io -------------//

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("chat on", (room) => {
    socket.join(room);
    // console.log("chat with: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("not typing", (room) => socket.in(room).emit("not typing"));

  socket.on("new message", async (newMessage) => {
    const chat = newMessage?.chat;

    await Notification.create({
      receiver: chat?.users,
      chat: chat?._id,
    });

    if (!chat?.users) return;
    chat.users.forEach((user) => {
      if (user?._id === newMessage?.sender?._id) return;
      socket.in(user?._id).emit("message received", newMessage);
    });
  });
});
