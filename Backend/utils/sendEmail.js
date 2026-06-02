import SibApiV3Sdk from "@getbrevo/brevo";
const { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } = SibApiV3Sdk;

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async ({ email, subject, message }) => {
  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = message;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};