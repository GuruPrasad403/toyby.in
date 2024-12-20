import axios from 'axios';

export async function sendSMS(phoneNumber, message) {
  const apiKey = 'GEw6JsuaTPrfR9oclhK7zF2bx5NUnkQOLW18iemAVg340MZCIydTcj34gRSpY5KyoJLFr8CkxQ1qbWAH'; // Replace with your Fast2SMS API key
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
        authorization: apiKey, // Updated API key header
        'Content-Type': 'application/json',
      },
    });

    console.log('SMS Sent Successfully:', response.data);
  } catch (error) {
    console.error('Error Sending SMS:', error.response ? error.response.data : error.message);
  }
}

// Example usage
// sendSMS('8951657957', 'Hello, this is a test message from Fast2SMS!');
