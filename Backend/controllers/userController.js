import ErrorHandler, { errorMiddleware } from "../middlewear/errorMiddlewear.js";
import User from "../Models/UserModel.js";
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import bcrypt from "bcrypt";
import{v2 as cloudinary}from "cloudinary";
export const getAllusers=catchAsynError(async(req,res,next)=>{
    const users=await User.find({Accountverification:true});
    res.status(200).json({
        success:true,
        users,
    })
})

export const registerNewAdmin=catchAsynError(async(req,res,next)=>{
    if(!req.files||Object.keys(req.files).length===0){
        return next(new ErrorHandler("Admin avatar is required",400));
    }
    const{name,email,password,regdno}=req.body;
    if(!name||!email||!password||!regdno){
        return next(new ErrorHandler("Enter all fields"),400);
    }
    const isRegistered = await User.findOne({email,Accountverification:true});
    if(isRegistered){return next(new ErrorHandler("User already registered",400));}
    if (password.length < 8 || password.length > 16) {
                return next(new ErrorHandler("Password should be between 8-16 characters", 400));
            }
    const{avatar}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/jpg","image/webp"];
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler("File format not supported.Only use png ,jpeg, jpg or webp"),400)
    }
    const hashedPassword =await bcrypt.hash(password,10);
    const cloudinaryResponse=await cloudinary.uploader.upload(avatar.tempFilePath,{
        folder:"Library_Management_Admins"
    })
    if(!cloudinaryResponse||cloudinaryResponse.error){
        console.error("cloudinary error:",cloudinaryResponse.error||"unknown cloudinary error.");
        return next(new ErrorHandler("failed to upload avatar image to cloudinary"),500);
    }
    const admin= await User.create({
        name,email,password:hashedPassword,role:"Admin",Accountverification:true,regdno,avatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        },
    })
    res.status(201).json({
        success:true,
        message:"Admin Registered successfully",
        admin
    })
})