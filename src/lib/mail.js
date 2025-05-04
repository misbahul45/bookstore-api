import 'dotenv/config';
import {
  MailerSend,
  EmailParams,
  Sender,
  Recipient
} from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export default async function sendEmail(userEmail, username, otp) {
  try {
    const sentFrom = new Sender("noreply@test-q3enl6kk36542vwr.mlsender.net", "BoockstoreApp");

    const recipients = [
      new Recipient(userEmail, username),
    ];
    
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Verify Your OTP for BoockstoreApp")
      .setHtml(`
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your OTP for BoockstoreApp</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #333;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
              color: #333;
            }
            .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              text-align: center;
              padding: 10px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your OTP for BoockstoreApp</h1>
            </div>
            <div class="content">
              <p>Hello ${username},</p>
              <p>We received a request to verify your account for BoockstoreApp. Please use the following One-Time Password (OTP) to complete your registration:</p>
              <div class="otp-code">${otp}</div>
              <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
              <p>If you did not request this, please ignore this email or contact our support team.</p>
              <p>Thank you for using BoockstoreApp!</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 BoockstoreApp, All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `)
      .setText(`Your OTP is ${otp}. This OTP is valid for 10 minutes.`);

    await mailerSend.email.send(emailParams);
  } catch (error) {
    throw new Error("Failed to send OTP: " + error.message);
  }
}
