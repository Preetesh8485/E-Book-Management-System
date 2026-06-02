const transporter = nodemailer.createTransport({
   host: "smtp-relay.brevo.com",
   port: 587,
   secure: false,
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
   },
   tls: {
      rejectUnauthorized: false,
   },
   connectionTimeout: 10000,
   greetingTimeout: 10000,
   socketTimeout: 10000,
});