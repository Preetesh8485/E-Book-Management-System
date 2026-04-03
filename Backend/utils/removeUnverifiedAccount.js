import cron from "node-cron"
import User from "../Models/UserModel.js"

export const removedUnverifiedAccounts = ()=>{
    cron.schedule("*/15 * * * *",async()=>{
        const fifteenMinsAgo= new Date(Date.now()-15*60*1000);
        await User.deleteMany({
            Accountverification:false,
            createdAt:{$lt: fifteenMinsAgo}
        }
        )
    })
}