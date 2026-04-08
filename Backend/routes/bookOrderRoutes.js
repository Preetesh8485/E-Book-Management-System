import express from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { isAuthorized } from "../controllers/authController.js";
import { createOrder, getAllOrders, markOrderDelivered} from "../controllers/bookContoller.js";

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
OrderRouter.get("/all",isAuthenticated,
    isAuthorized("Admin"),getAllOrders)


export default OrderRouter;