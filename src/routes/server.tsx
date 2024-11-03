'use server';

import axios from 'axios';

let paypalAuthToken = '';
let paypalAuthExpiry = 0;

export async function getPaypalAuth() {
  if (paypalAuthToken != '' && paypalAuthExpiry > Date.now()) {
    return paypalAuthToken;
  }
  const req = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    { grant_type: 'client_credentials' },
    {
      auth: {
        username:
          'Ac5FY-QJ5tFqRgQq26lpv3sYosX0UowW9auWTRi8xWCy9zS3n88SD4zb4KbDqSjUsx_TTR_DM8kmDLn6',
        password:
          'EAyDCyJQ2S_avdfX0dBl_qPAfGgjsYUscQrKn09cchUfSZRy_gJJbvWNmbJtKymYSqoJTuScyzSVUU_t',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  paypalAuthExpiry = Date.now() + req.data.expires_in * 1000;
  paypalAuthToken = req.data.access_token;
  return paypalAuthToken;
}
