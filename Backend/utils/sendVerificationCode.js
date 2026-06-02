import apiInstance from "../config/brevo.js";
import { EMAIL_VERIFY_TEMPLATE } from "./emailTemplates.js";

export async function SendVerificationCode(
    verificationCode,
    email,
    res
) {
    try {

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

        return res.json({
            success: true,
            message: "Verification email sent successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Verification OTP failed to send",
            error: error.message
        });
    }
}