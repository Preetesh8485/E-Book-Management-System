import cron from "node-cron"
import { Borrow } from "../Models/borrowModel.js";
import User from "../Models/UserModel.js";
import { sendEmail } from "./sendEmail.js";
export const notifyUser=()=>{
cron.schedule("*/30 * * * *",async()=>{
    try {
        const oneDayAgo= new Date(Date.now()-24*60*60*1000);
        const borrowers= await Borrow.find({
            dueDate:{
                $lt:oneDayAgo
            },
            returnDate:null,
            notified:false
        })
        for(const element of borrowers){
            if(element.user&&element.user.email){
                const user=await User.findById(element.user.id);
                sendEmail({
                    email,
                    subject:"book return reminder",
                    
                })
            }
        }
    } catch (error) {
        
    }
})
}