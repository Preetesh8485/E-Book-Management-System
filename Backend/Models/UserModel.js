import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken"
const userSchema =new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true,select:false},
    role:{
        type:String,
        enum:["Admin","Member"],
        default:"Member",
    },
    Accountverification:{type:Boolean,default:false},
    borrowedBooks:[{
        ISBN:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Borrow",
        },
        returned:{
            type:Boolean,
            default:false,
        },
        BookTitle:String,
        borrowedDate:Date,
        dueDate:Date,
    },
    ],
    avatar:{
        public_id:String,
        url:String,
    },
    OTP:{type:Number},
    OTPExpiredAt:{type:Date},
    OTPReset:{type:String},
    OTPResetAt:{type:Date}
},
{timestamps:true});
userSchema.methods.generateOTP = function () {
    const otp = crypto.randomInt(10000, 99999);
    this.OTP = otp;
    this.OTPExpiredAt = Date.now() + 15 * 60 * 1000;
    return otp;
};
userSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE}
        
    )
}

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;