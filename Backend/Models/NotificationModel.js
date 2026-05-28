import mongoose from "mongoose";

const wishlistNotificationSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  book:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"book"
  },

  notified:{
    type:Boolean,
    default:false
  }

},{timestamps:true})

export const WishlistNotification =mongoose.model("WishlistNotification",wishlistNotificationSchema);