
import transporter from "../config/nodemailer.js";
export const sendEmail= async({email,subject,message})=>{
    const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject,
                html: message
            }
            await transporter.sendMail(mailOptions);
}