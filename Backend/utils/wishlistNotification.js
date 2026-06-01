import cron from "node-cron";

import {
WishlistNotification
}
from "../Models/NotificationModel.js";

import { sendEmail }
from "./sendEmail.js";

export const notifyWishlistUsers = ()=>{

cron.schedule("* * * * *", async()=>{

   try {
      const users =
      await WishlistNotification.find({
         notified:false
      })
      .populate("user")
      .populate("book");

      for(const element of users){

         if(
            element.book &&
            element.book.quantity > 0
         ){

            await sendEmail({

               email:element.user.email,

               subject:"Book Back In Stock",

               message:`

<h2>Hello ${element.user.name}</h2>

<p>
Good news!
</p>

<p>
<b>${element.book.title}</b>
is now back in stock.
</p>

<p>
Order before it goes out of stock again.
</p>

               `
            });

            element.notified = true;

            await element.save();

            console.log(
               `Wishlist mail sent to ${element.user.name}`
            );

         }

      }

   } catch (error) {

      console.error(
         "Wishlist cron error",
         error
      );

   }

})

}