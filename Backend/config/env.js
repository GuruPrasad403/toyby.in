import 'dotenv/config'

export const DB_URL = process.env.DB_URL
export const JWT  = process.env.JWT_SECRECT
export const PORT = process.env.PORT
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const twilioSid = process.env.TWILIO_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
