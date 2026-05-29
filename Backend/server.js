import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { errorMiddleware } from "./middlewear/errorMiddlewear.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/BookRoutes.js";
import orderRouter from "./routes/bookOrderRoutes.js";
import borrowRouter from "./routes/borrowRouter.js";
import UserRouter from "./routes/userRouter.js";
import { validateBody } from "./middlewear/validateBody.js";
import { v2 as cloudinary } from "cloudinary";
import expressFileupload from "express-fileupload";
import { notifyUser } from "./utils/notifyUsers.js";
import { removedUnverifiedAccounts } from "./utils/removeUnverifiedAccount.js";
import Wishrouter from "./routes/wishlistRoutes.js";
import { notifyWishlistUsers } from "./utils/wishlistcron.js";
import reqRouter from "./routes/requestRoutes.js";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
const app = express();
const httpServer = createServer(app);
const allowedOrigins = ["http://localhost:5173"];
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
export const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("register", (userId) => {
    connectedUsers.set(userId.toString(), socket.id);
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  });
  socket.on("joinAdminRoom", () => {
    socket.join("admins");
    console.log(`Admin joined admin room: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
const port = process.env.PORT || 4000;
notifyUser();
notifyWishlistUsers();
removedUnverifiedAccounts();
connectDB();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileupload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(validateBody);
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);
app.use("/api/order", orderRouter);
app.use("/api/borrow", borrowRouter);
app.use("/api/user", UserRouter);
app.use("/api/wishlist", Wishrouter);
app.use("/api/request", reqRouter);
app.use(errorMiddleware);
httpServer.listen(port, () => console.log(`Server running on PORT: ${port}`));