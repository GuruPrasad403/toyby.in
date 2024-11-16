import 'dotenv/config'

export const DB_URL = process.env.DB_URL
export const JWT  = process.env.JWT_SECRECT
export const PORT = process.env.PORT
export const accountSid = process.env.TWILIO_ACCOUNT_SID;
export const authToken = process.env.TWILIO_AUTH_TOKEN;
export const smsApi = process.env.API_KEY 