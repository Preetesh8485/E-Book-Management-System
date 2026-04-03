import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { errorMiddleware } from "./middlewear/errorMiddlewear.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/BookRoutes.js";
import orderRouter from "./routes/bookOrderRoutes.js"
import borrowRouter from "./routes/borrowRouter.js";
import UserRouter from "./routes/userRouter.js";
import { validateBody } from "./middlewear/validateBody.js";
import{v2 as cloudinary}from "cloudinary";
import expressFileupload from "express-fileupload"
import { notifyUser } from "./utils/notifyUsers.js";
import { removedUnverifiedAccounts } from "./utils/removeUnverifiedAccount.js";
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
  api_key:process.env.CLOUDINARY_CLIENT_API,
  api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
})
const app = express();

const port = process.env.PORT || 4000;
notifyUser();
removedUnverifiedAccounts();
connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(expressFileupload({
  useTempFiles:true,
  tempFileDir:"/tmp/"
}))
app.use(validateBody);
app.get("/", (req, res) => res.send("API working"));
app.use('/api/auth',authRouter);
app.use('/api/book',bookRouter);
app.use('/api/order',orderRouter);
app.use('/api/borrow',borrowRouter);
app.use('/api/user',UserRouter);


app.use(errorMiddleware);
app.listen(port, () =>
  console.log(`Server running on PORT: ${port}`)
);