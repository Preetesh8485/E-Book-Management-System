import SibApiV3Sdk from "@getbrevo/brevo";
const { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } = SibApiV3Sdk;
import { EMAIL_VERIFY_TEMPLATE } from "./emailTemplates.js";

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function SendVerificationCode(verificationCode, email, res) {
    try {
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.subject = "Library Account verification OTP";
        sendSmtpEmail.htmlContent = EMAIL_VERIFY_TEMPLATE
            .replace("{{otp}}", verificationCode)
            .replace("{{email}}", email);

        await apiInstance.sendTransacEmail(sendSmtpEmail);

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