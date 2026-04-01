import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { errorMiddleware } from "./middlewear/errorMiddlewear.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/BookRoutes.js";
import orderRouter from "./routes/bookOrderRoutes.js"
import { validateBody } from "./middlewear/validateBody.js";
const app = express();

const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(validateBody);
app.get("/", (req, res) => res.send("API working"));
app.use('/api/auth',authRouter);
app.use('/api/book',bookRouter);
app.use('/api/order',orderRouter);


app.use(errorMiddleware);
app.listen(port, () =>
  console.log(`Server running on PORT: ${port}`)
);