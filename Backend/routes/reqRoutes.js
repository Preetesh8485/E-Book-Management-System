import express from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { approveRequest, getAllRequests, rejectRequest, requestBook } from "../controllers/bookRequestController.js";
import { isAuthorized } from "../controllers/authController.js";

const RequestRouter=express.Router();
RequestRouter.post("/request-book/:id", isAuthenticated, requestBook);
RequestRouter.get("/all-requests",isAuthenticated, isAuthorized("Admin"),getAllRequests);
RequestRouter.put("/approve-request/:requestId",isAuthenticated,isAuthorized("Admin"),approveRequest);
RequestRouter.put("/reject-request/:requestId",isAuthenticated,isAuthorized("Admin"),rejectRequest);
export default RequestRouter;