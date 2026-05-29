import express from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { isAuthorized } from "../controllers/authController.js";
import {
  createBookRequest,
  getAllBookRequests,
  getMyBookRequests,
  approveBookRequest,
  rejectBookRequest,
} from "../controllers/bookrequestController.js";

const reqRouter = express.Router();

reqRouter.post("/create", isAuthenticated, createBookRequest);
reqRouter.get("/my", isAuthenticated, getMyBookRequests);
reqRouter.get("/all", isAuthenticated, isAuthorized("Admin"), getAllBookRequests);
reqRouter.put("/approve/:id", isAuthenticated, isAuthorized("Admin"), approveBookRequest);
reqRouter.put("/reject/:id", isAuthenticated, isAuthorized("Admin"), rejectBookRequest);

export default reqRouter;