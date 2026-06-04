import express from "express";
import { isAuthenticated } from "../middlewear/authMiddlewear.js";
import { chatWithAI } from "../controllers/aiChatController.js";


const airouter = express.Router();

airouter.post(
  "/chat",
  isAuthenticated,
  chatWithAI
);

export default airouter;