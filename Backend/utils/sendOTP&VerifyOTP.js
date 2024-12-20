import axios from 'axios';
import { smsApi } from '../config/env.js';


export async function sendOTP(phoneNumber, message) {
console.log(smsApi)
  const url = 'https://www.fast2sms.com/dev/bulkV2'; // Updated API endpoint

  const data = {
    route: 'q', // Use 'q' for quick transactional route
    sender_id: 'FSTSMS', // Sender ID (approved sender ID for your account)
    message: message,
    language: 'english',
    numbers: phoneNumber, // Comma-separated phone numbers for multiple recipients
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        authorization: smsApi, // Updated API key header
        'Content-Type': 'application/json',
      },
    });

    console.log('SMS Sent Successfully:', response.data);
  } catch (error) {
    console.error('Error Sending SMS:', error.response ? error.response.data : error.message);
  }
}


// Example usage
