import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "./emailTemplates.js";

export async function SendVerificationCode(verificationCode, email, res) {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Library Account verification OTP",
            html: EMAIL_VERIFY_TEMPLATE
                .replace("{{otp}}", verificationCode)
                .replace("{{email}}", email)
        };

        await transporter.sendMail(mailOptions);

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