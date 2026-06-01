import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import { WishlistNotification } from "../Models/NotificationModel.js";

export const addWishlistNotification = catchAsynError(async (req,res,next)=>{
   try {

      const {bookId}=req.body;

      const alreadyExists =
      await WishlistNotification.findOne({
        user:req.user._id,
        book:bookId,
        notified:false
      })

      if(alreadyExists){
        return res.status(400).json({
          success:false,
          message:"Already added"
        })
      }

      await WishlistNotification.create({
        user:req.user._id,
        book:bookId
      })

      res.status(201).json({
        success:true,
        message:"Notification enabled"
      })

   } catch (error) {
      res.status(500).json({
        success:false,
        message:error.message
      })
}
})