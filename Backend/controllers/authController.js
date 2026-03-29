import ErrorHandler, { errorMiddleware } from "../middlewear/errorMiddlewear.js";
import User from "../Models/UserModel.js";
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {  SendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsynError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new ErrorHandler("please enter all fields", 400));
        }
        const isRegistered = await User.findOne({ email, Accountverification: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already exists! please login", 400));
        }
        const registrationAttemptsByUser = await User.find({
            email,
            Accountverification: false,
        });
        if (registrationAttemptsByUser.length >= 5) {
            return next(new ErrorHandler("Too many unsuccessfull attemps,please contact support", 400));
        }
        if (password.length < 8 || password.length > 16) {
            return next(new ErrorHandler("Password should be between 8-16 characters", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const verificationCode = newUser.generateOTP();
        await newUser.save();
        SendVerificationCode(verificationCode, email, res);
    } catch (error) {
        next(error);
    }
});
export const verifyOTP = catchAsynError(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Fill all details", 400));
    }

    try {
        const userAllEntries = await User.find({
            email,
            Accountverification: false,
        }).sort({ createdAt: -1 });

        if (userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found", 404));
        }

        let user;

        if (userAllEntries.length > 1) {
            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                Accountverification: false,
            });
        }else{
            user= userAllEntries[0];
        }

        if (user.OTP !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP", 400));
        }

        if (Date.now() > user.OTPExpiredAt) {
            return next(new ErrorHandler("OTP expired. Try again!", 400));
        }

        user.Accountverification = true;
        user.OTP = null;
        user.OTPExpiredAt = null;
        await user.save({ validateModifiedOnly: true });
        sendToken(user, 200, "Account verified", res);

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
});
export const login = catchAsynError(async(req,res,next)=>{
 const{email,password}=req.body;
 if(!email||!password){return next(new ErrorHandler("Email or password field is empty",400));

 }
 const  user = await User.findOne({
    email,
    Accountverification:true,
 }).select("+password");
 if(!user){
    return next(new ErrorHandler("Invalid email or password",400));
 }
 const isPasswordMatched= await bcrypt.compare(password,user.password);
 if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",400));
 }
 sendToken(user,200,"User LoggedIn successfully.",res);
});
export const logout = catchAsynError(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
    }).json({
        success:true,
        message:"logged out successfully"
    });
})
export const getUser=catchAsynError(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    })
})
export const forgotPassword=catchAsynError(async(req,res,next)=>{
    const user = await User.findOne({
        email:req.body.email,
        Accountverification:true,
    });
    if(!req.body.email){
        next(new ErrorHandler("Email field is empty",400));
    }
    if(!user){
        next(new ErrorHandler("User not found",400));
    }
    const resetToken =user.getRestPasswordToken();
    await user.save({validateBeforeSave:false});
    const passwordResetURL=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    const message=generateForgotPasswordEmailTemplate(user.name,passwordResetURL);
    try {
        await sendEmail({email:user.email,
            subject:"EBMS passoword reset",
            message,
        })
        res.status(200).json({
            success:true,
            message:`Reset email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.OTPReset=undefined;
        user.OTPResetAt=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }
})
export const resetPassword=catchAsynError(async(req,res,next)=>{
    const{token}=req.params;
    const OTPReset =crypto.createHash("sha256").update(token).digest("hex");
    const user=await User.findOne({
        OTPReset,
        OTPResetAt:{$gt:Date.now()},

    })
    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or expired",400));
    }
    if(req.body.password!==req.body.confirmPassword){
       return next(new ErrorHandler("Password and confirm password do not match",400));
    }
    if (req.body.password.length < 8 || req.body.password.length > 16||req.body.confirmPassword.length < 8 || req.body.confirmPassword.length > 16) {
            return next(new ErrorHandler("Password should be between 8-16 characters", 400));
        }
    const hashedPassword=await  bcrypt.hash(req.body.password,10);
    user.password=hashedPassword;
    user.OTPReset=undefined;
    user.OTPResetAt=undefined;
    await user.save();
    sendToken(user,200,"password reset successfully updated",res)
    
})
