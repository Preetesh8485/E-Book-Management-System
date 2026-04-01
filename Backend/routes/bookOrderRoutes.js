import express from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { isAuthorized } from "../controllers/authController.js";
import { createOrder, markOrderDelivered} from "../controllers/bookContoller.js";

const OrderRouter = express.Router();

OrderRouter.post(
    "/create",
    isAuthenticated,
    isAuthorized("Admin"),
    createOrder
);
OrderRouter.put(
    "/deliver/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    markOrderDelivered
);


export default OrderRouter;