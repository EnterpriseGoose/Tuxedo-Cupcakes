import axios from 'axios';
import { getPaypalAuth } from '../server';
import { redirect } from '@solidjs/router';

async function capturePayment(token: string) {
  'use server';
  if (!token) {
    return { status: 'CANCELED', redirect: redirect('/order?status=canceled') };
  }
  console.log('payment capturing');
  const paypalAuthToken = await getPaypalAuth();
  const req = await axios.post(
    process.env.PAYPAL_URL + `/v2/checkout/orders/${token}/capture`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paypalAuthToken}`,
        Prefer: 'return=representation',
      },
    }
  );
  console.log(req.data);
  if (req.status == 201 && req.data.status == 'COMPLETED') {
    return {
      status: 'SUCCESS',
      redirect: redirect(`/order/success?token=${token}&log=y`),
    };
  } else {
    return { status: 'ERROR', redirect: redirect('/order?status=error') };
  }
}

export async function GET(APIEvent: { request: Request }) {
  try {
    const urlParams = new URLSearchParams(APIEvent.request.url.split('?')[1]);
    const payment = await capturePayment(urlParams.get('token'));
    return payment.redirect;
  } catch {
    return redirect('/order?status=error');
  }
}
