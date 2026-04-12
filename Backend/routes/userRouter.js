import express from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { isAuthorized } from "../controllers/authController.js";
import { deleteMemberUser, getAllusers,registerNewAdmin } from "../controllers/userController.js";
const UserRouter = express.Router();
UserRouter.get("/all",isAuthenticated,isAuthorized("Admin"),getAllusers);
UserRouter.post("/add/new-admin",isAuthenticated,isAuthorized("Admin"),registerNewAdmin);
UserRouter.delete("/remove/member/:id",isAuthenticated,isAuthorized("Admin"),deleteMemberUser);


export default UserRouter;