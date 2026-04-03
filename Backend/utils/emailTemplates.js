export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Email Verify</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Verify your email
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          You are just one step away to verify your account for this email: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use below OTP to verify your account.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          This OTP is valid for 24 hours.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a password reset request for your account: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          The password reset otp is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export function generateForgotPasswordEmailTemplate(userName, resetLink) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px;">
      
      <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
      
      <p>Hi ${userName},</p>
      
      <p>We received a request to reset your password.</p>
      
      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" 
           style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      
      <p>This link will expire in <strong>10 minutes</strong>.</p>
      
      <p>If you did not request this, please ignore this email.</p>
      
      <hr />
      
      <p style="font-size: 12px; color: #777;">
        For security reasons, do not share this link with anyone.
      </p>
      
    </div>

  </body>
  </html>
  `;
}
export const borrowTemplate = (name, bookTitle, dueDate) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #4CAF50;">📚 Book Issued Successfully</h2>
      <p>Hello <b>${name}</b>,</p>
      <p>You have borrowed <b>${bookTitle}</b>.</p>
      <p>📅 Due Date: <b>${new Date(dueDate).toDateString()}</b></p>
      <p>Please return it on time to avoid fines.</p>
    </div>
  `;
};
export const pendingBooksReminderTemplate = (name) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #dc2626; text-align: center;">
        📚 Pending Book Reminder
      </h2>
      
      <p style="font-size: 16px; color: #333;">
        Hello <b>${name}</b>,
      </p>
      
      <p style="font-size: 15px; color: #444;">
        This is a friendly reminder that you have one or more books pending to return.
      </p>
      
      <div style="margin: 20px 0; padding: 12px; background-color: #fee2e2; border-left: 5px solid #dc2626; border-radius: 5px;">
        <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
          Please return them as soon as possible to avoid any late fines.
        </p>
      </div>
      
      <p style="font-size: 14px; color: #555;">
        Thank you,<br/>
        <b>Library Management System</b>
      </p>
      
    </div>
    
  </div>
  `;
};
export const fineWarningTemplate = (name, fine, days = 7) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #dc2626; text-align: center;">
        ⚠️ Fine Payment Required
      </h2>
      
      <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
      
      <p style="font-size: 15px;">
        You have successfully returned your borrowed book. However, a late fine has been applied.
      </p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #fee2e2; border-left: 5px solid #dc2626; border-radius: 5px;">
        <p style="margin: 0; font-size: 16px;">
          💰 <b>Fine Amount: ₹${fine}</b>
        </p>
      </div>
      
      <p style="font-size: 14px; color: #444;">
        Please ensure that the fine is paid within <b>${days} days</b>.
      </p>
      
      <div style="margin-top: 15px; padding: 12px; background-color: #fff3cd; border-left: 5px solid #ff9800; border-radius: 5px;">
        <p style="margin: 0; font-size: 14px; color: #7c2d12;">
          Failure to pay within this period may result in suspension of your library access.
        </p>
      </div>
      
      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        Regards,<br/>
        <b>Library Management System</b>
      </p>
      
    </div>
    
  </div>
  `;
};
export const returnSuccessTemplate = (name) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #16a34a; text-align: center;">
        ✅ Book Returned Successfully
      </h2>
      
      <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
      
      <p style="font-size: 15px;">
        Your borrowed book has been successfully returned.
      </p>
      
      <div style="margin: 20px 0; padding: 12px; background-color: #dcfce7; border-left: 5px solid #16a34a; border-radius: 5px;">
        <p style="margin: 0; font-size: 14px;">
          🎉 No dues are pending. Thank you for returning the book on time!
        </p>
      </div>
      
      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        Regards,<br/>
        <b>Library Management System</b>
      </p>
      
    </div>
    
  </div>
  `;
};