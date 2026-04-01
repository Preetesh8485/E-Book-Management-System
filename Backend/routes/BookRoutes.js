import express, { Router } from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import{} from "../controllers/bookContoller.js";
import { addBook,DeleteBook,showBook } from "../controllers/bookContoller.js";
import { isAuthorized } from "../controllers/authController.js";

const bookRouter=express.Router();
bookRouter.post("/admin/addBook",isAuthenticated,isAuthorized("Admin"),addBook);
bookRouter.post("/admin/delete/:id",isAuthenticated,isAuthorized("Admin"),DeleteBook);
bookRouter.get("/showBook",isAuthenticated,showBook);
export default bookRouter;