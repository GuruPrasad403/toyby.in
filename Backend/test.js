import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendEmail(to,Sub,textMessage,) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        let info = await transporter.sendMail({
            from: `"Toyby Admin" <${process.env.EMAIL_USER}>`,
            to: 'guruprasas27@gmail.com',
            subject: 'Welcome to Toyby!',
            text: 'Thank you for signing up!',
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Toyby</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 30px auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #eee;
                }
                .header h1 {
                    color: #333333;
                    font-size: 24px;
                    margin: 0;
                }
                .message {
                    font-size: 16px;
                    color: #555555;
                    line-height: 1.6;
                    margin: 20px 0;
                }
                .otp {
                    display: block;
                    text-align: center;
                    font-size: 36px;
                    font-weight: bold;
                    color: #4CAF50;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777777;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Welcome to Toyby!</h1>
                </div>
                <div class="message">
                    Thank you for signing up with Toyby! We’re excited to have you on board.
                    <br><br>
                    Please use the OTP below to verify your account:
                </div>
                <span class="otp">${textMessage.otp}</span>
                <div class="message">
                    This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.
                </div>
                <div class="footer">
                    © 2024 Toyby | All rights reserved.
                </div>
            </div>
        </body>
        </html>
            `,
        });
        
        console.log('Message sent successfully: %s', info.messageId);
    } catch (error) {
        console.error('Error while sending email:', error);
    }
}

sendEmail();
