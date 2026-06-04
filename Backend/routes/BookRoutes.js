import express, { Router } from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { } from "../controllers/bookContoller.js";
import { addBook, DeleteBook, showBook, generateBookMetadata } from "../controllers/bookContoller.js";
import { isAuthorized } from "../controllers/authController.js";
import { upload } from "../middlewear/multer.js";

const bookRouter = express.Router();
bookRouter.post("/admin/addBook", isAuthenticated, isAuthorized("Admin"), upload.single("image"), addBook);
bookRouter.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), DeleteBook);
bookRouter.get("/showBook", isAuthenticated, showBook);
bookRouter.post("/admin/generate-metadata",isAuthenticated,isAuthorized("Admin"),generateBookMetadata);
export default bookRouter;