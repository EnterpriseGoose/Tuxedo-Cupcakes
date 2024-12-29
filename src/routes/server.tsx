'use server';

import axios from 'axios';
import 'dotenv/config';

let paypalAuthToken = '';
let paypalAuthExpiry = 0;

export async function getPaypalAuth() {
  if (paypalAuthToken != '' && paypalAuthExpiry > Date.now()) {
    return paypalAuthToken;
  }
  try {
    const req = await axios.post(
      process.env.PAYPAL_URL + '/v1/oauth2/token',
      { grant_type: 'client_credentials' },
      {
        auth: {
          username: process.env.PAYPAL_USERNAME_PROD,
          password: process.env.PAYPAL_PASSWORD_PROD,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    paypalAuthExpiry = Date.now() + req.data.expires_in * 1000;
    paypalAuthToken = req.data.access_token;
    return paypalAuthToken;
  } catch (e) {
    console.log(e);
  }
}
