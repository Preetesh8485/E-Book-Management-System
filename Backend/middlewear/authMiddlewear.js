import { catchAsynError } from "./CatchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewear.js";
import jwt from "jsonwebtoken"
import User from "../Models/UserModel.js"
export const isAuthenticated=catchAsynError(async(req,res,next)=>{
    const{token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("User is not authenticated.",400))
    }
    const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decoded.id);
    next();
})