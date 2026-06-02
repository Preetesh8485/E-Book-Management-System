import apiInstance from "../config/brevo.js";
import { EMAIL_VERIFY_TEMPLATE } from "./emailTemplates.js";

export async function SendVerificationCode(
    verificationCode,
    email
) {

    await apiInstance.sendTransacEmail({

        sender: {
            email: process.env.SENDER_EMAIL,
            name: "Digital Library"
        },

        to: [
            {
                email: email
            }
        ],

        subject: "Library Account verification OTP",

        htmlContent: EMAIL_VERIFY_TEMPLATE
            .replace("{{otp}}", verificationCode)
            .replace("{{email}}", email)
    });
}