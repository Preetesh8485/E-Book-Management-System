import express from "express";

import {addWishlistNotification}from "../Controllers/wishlistController.js";

import { isAuthenticated }from "../middlewear/authMiddlewear.js";

const Wishrouter=express.Router();

Wishrouter.post("/notify",isAuthenticated,addWishlistNotification)

export default Wishrouter;