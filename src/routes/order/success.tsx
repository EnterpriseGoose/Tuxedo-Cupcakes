import Layout from '~/components/Layout';
import styles from './success.module.scss';
import axios from 'axios';
import { getPaypalAuth } from '../server';
import { useSearchParams } from '@solidjs/router';
import { createSignal, For, onMount, Show } from 'solid-js';
import CupcakeBox from '~/components/CupcakeBox';
import { decodeBox, encodeBox } from '~/components/CupcakeBox/CupcakeBox';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function logAndEmail(orderData: Order, token: string, order: any) {
  'use server';

  const supabase = createClient(
    'https://rxznihvftodgtjdtzbyr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
  );

  const minifiedBoxes = Array.from(orderData.boxes, (box: Box) => ({
    type: box.type,
    cupcakes: Object.entries(
      box.cupcakes.reduce((flavorList, nextFlavor) => {
        if (Object.keys(flavorList).includes(nextFlavor.name))
          flavorList[nextFlavor.name] += 1;
        else flavorList[nextFlavor.name] = 1;
        return flavorList;
      }, {})
    ).reduce(
      (currString, flavor) => currString + flavor[0] + ' ×' + flavor[1] + `, `,
      ''
    ),
    url: `https://tuxedocupcakes.com/order/display?t=${encodeBox(box).t}&f=${
      encodeBox(box).f
    }`,
  }));

  let response = await supabase.from('orders').insert({
    id: token,
    market: {
      market: orderData.market,
      time: orderData.time,
      name: orderData.name,
    },
    boxes: JSON.stringify(minifiedBoxes),
    name: orderData.info.name,
    email: orderData.info.email,
    phone: orderData.info.phone,
    extraInfo: orderData.info.extra,
    newsletter: orderData.info.newsletter,
    discount: JSON.stringify(orderData.info.discount),
  });
  console.log(response.status);

  if (
    response.status == 201 &&
    orderData.info.discount &&
    !orderData.info.discount.used
  ) {
    let result = await supabase.rpc('use_discount', {
      usecode: orderData.info.discount.code,
    });
    console.log(result);
  }

  const msgToMe: sgMail.MailDataRequired = {
    to: 'oliverxwu@gmail.com',
    from: 'olive@tuxedocupcakes.com',
    subject: 'New order placed!',
    text:
      `A new order has been placed through the website: ` +
      JSON.stringify(order) +
      ' ' +
      JSON.stringify(orderData),
  };
  const msgToThem: sgMail.MailDataRequired = {
    to: orderData.info.email,
    bcc: 'olive@tuxedocupcakes.com',
    from: 'olive@tuxedocupcakes.com',
    subject: 'Thank you for your Tuxedo Cupcakes order!',
    html: getEmail(orderData),
  };

  console.dir([msgToMe, msgToThem]);

  try {
    console.log(await sgMail.send(msgToMe));
    console.log(await sgMail.send(msgToThem));
  } catch (e) {
    console.log(e);
  }
}

export default function Success() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = createSignal<any>();

  onMount(async () => {
    if (searchParams.token) {
      setOrder(
        await getOrder(
          Array.isArray(searchParams.token)
            ? searchParams.token[0]
            : searchParams.token
        )
      );

      const orderData = JSON.parse(localStorage.getItem('orderData')).order;
      if (orderData && searchParams.log == 'y') {
        logAndEmail(
          orderData,
          Array.isArray(searchParams.token)
            ? searchParams.token[0]
            : searchParams.token,
          order()
        );

        if (orderData.info.save) {
          localStorage.setItem(
            'orderData',
            JSON.stringify({ order: { info: orderData.info } })
          );
        } else {
          localStorage.setItem('orderData', '{}');
        }

        setSearchParams({ log: '' });
      }
    }
  });

  return (
    <Layout hideFooter>
      <div class={styles.success}>
        <h1>Order Placed Successfully!</h1>
        <p>
          Thank you for placing an order! I'll send an email soon with a final
          confirmation and any extra details.
        </p>
        <Show when={order()}>
          <h3>Order Details:</h3>
          <p>
            Name: {order().payer.name.given_name} {order().payer.name.surname}
            <br />
            Email: {order().payer.email_address}
            <br />
            Total: ${order().purchase_units[0].amount.value}
          </p>
          <div class={styles.boxArray}>
            <For each={order().purchase_units[0].items}>
              {(box, index) => (
                <a
                  href={`/order/display?t=${box.name.split(' ')[1][0]}-${
                    box.name.split(' ')[0]
                  }-${box.unit_amount.value.split('.')[0]}&f=${box.sku}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CupcakeBox
                    box={decodeBox({
                      t:
                        box.name.split(' ')[1][0] +
                        '-' +
                        box.name.split(' ')[0] +
                        '-' +
                        box.unit_amount.value.split('.')[0],
                      f: box.sku,
                    })}
                    scale={1.2}
                    detailedTooltip
                  />
                </a>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Layout>
  );
}

async function getOrder(token: string) {
  'use server';
  const paypalAuthToken = await getPaypalAuth();

  const req = await axios.get(
    process.env.PAYPAL_URL + `/v2/checkout/orders/${token}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paypalAuthToken}`,
      },
    }
  );

  if (req.status == 200) return req.data;
  return;
}

function getEmail(orderData: Order) {
  return `<!doctype html>
<html>

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Tuxedo Cupcakes Newsletter - 9/27 Newsletter</title>
<style>
@media only screen and (max-width: 620px) {
  table[class=body] h1 {
    font-size: 28px !important;
    margin-bottom: 10px !important;
  }

  table[class=body] p,
table[class=body] ul,
table[class=body] ol,
table[class=body] td,
table[class=body] span,
table[class=body] a {
    font-size: 16px !important;
  }

  table[class=body] .wrapper,
table[class=body] .article {
    padding: 10px !important;
  }

  table[class=body] .content {
    padding: 0 !important;
  }

  table[class=body] .container {
    padding: 0 !important;
    width: 100% !important;
  }

  table[class=body] .main {
    border-left-width: 0 !important;
    border-radius: 0 !important;
    border-right-width: 0 !important;
  }

  table[class=body] .btn table {
    width: 100% !important;
  }

  table[class=body] .btn a {
    width: 100% !important;
  }

  table[class=body] .img-responsive {
    height: auto !important;
    max-width: 100% !important;
    width: auto !important;
  }
}
@media (prefers-color-scheme: dark) {
  .header table tr td a img {
    background: #eaebed;
    padding: 15px;
    border-radius: 15px;
    margin-bottom: -15px;
  }
}
@media all {
  .ExternalClass {
    width: 100%;
  }

  .ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
    line-height: 100%;
  }

  .apple-link a {
    color: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    text-decoration: none !important;
  }

  .btn-primary table td:hover {
    background-color: #3b6d79 !important;
  }

  .btn-primary a:hover {
    background-color: #3b6d79 !important;
    border-color: #3b6d79 !important;
  }
}
</style></head>

<body class style="background-color: #eaebed; font-family: Verdana, Geneva, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.2; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
    <tr>
      <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
      <td class="container" style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; Margin: 0 auto;" width="580" valign="top">
        <div class="header" style="padding: 20px 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;">
            <tr>
              <td class="align-center" width="100%" style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                <a href="https://tuxedocupcakes.com" rel="noopener noreferrer" target="_blank" style="color: #407682; text-decoration: underline;"><img src="https://tuxedocupcakes.com/images/full-logo.png" width="300px" alt="Tuxedo Cupcakes Logo" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;"></a>
              </td>
            </tr>
          </table>
        </div>
        <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

          <!-- START CENTERED WHITE CONTAINER -->
          <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"></span>
          <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 15px 15px 0 0; width: 100%;" width="100%">

            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper" style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                  <tr>
                    <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                      <h1 style="color: #06090f; font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 1.2; margin: 0; margin-bottom: 30px; font-size: 30px; font-weight: 400; text-align: center;">
                        Your order has been placed!
                      </h1>
                      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18px; font-weight: lighter; margin: 0; margin-bottom: 15px;">Thank you for placing an order through the Tuxedo Cupcakes website! This is a confirmation that
                        I got your payment and order, and am currently processing it. Expect a reply within 12 hours
                        with any final details I will need to complete your order.
                      </p>
                      <br><br>
                      <h2 style="color: #06090f; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: 400; line-height: 1.2; margin: 0; margin-bottom: 30px;">Your Boxes:</h2>
                      <ul style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18px; font-weight: lighter; margin: 0; margin-bottom: 15px;">
											${orderData.boxes.reduce((currString, box, i) => {
                        return (
                          currString +
                          `
													<li style="list-style-position: inside; margin-left: 5px;">${
                            box.type.quantity
                          } ${
                            box.type.regular ? 'Regular' : 'Mini'
                          } Cupcakes ($${box.type.price})
														<ul style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18px; font-weight: lighter; margin: 0; margin-bottom: 15px;">
															${Object.entries(
                                box.cupcakes.reduce(
                                  (flavorList, nextFlavor) => {
                                    if (
                                      Object.keys(flavorList).includes(
                                        nextFlavor.name
                                      )
                                    )
                                      flavorList[nextFlavor.name] += 1;
                                    else flavorList[nextFlavor.name] = 1;
                                    return flavorList;
                                  },
                                  {}
                                )
                              ).reduce(
                                (currString, flavor) =>
                                  currString +
                                  `<li style="list-style-position: inside; margin-left: 5px;">` +
                                  flavor[0] +
                                  ' x' +
                                  flavor[1] +
                                  `</li>
																	`,
                                ''
                              )}
														</ul>
													</li>
													`
                        );
                      }, '')}
                        
                      </ul>
                      <br>
                      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18px; font-weight: lighter; margin: 0; margin-bottom: 15px;">Order total: $${orderData.boxes.reduce(
                        (prevCost, box) => prevCost + box.type.price,
                        0
                      )}</p>
                      <br><br>
                      <h2 style="color: #06090f; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: 400; line-height: 1.2; margin: 0; margin-bottom: 30px;">Other Details:</h2>
                      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18px; font-weight: lighter; margin: 0; margin-bottom: 15px;">
                        Name: ${orderData.info.name}<br>
                        Email: ${orderData.info.email}<br>
                        ${
                          orderData.info.phone
                            ? `Phone: ${orderData.info.phone}<br>`
                            : ''
                        }
                        Delivery Details: ${orderData.info.extra}<br>
                        ${orderData.info.newsletter ? `Newsletter: Yes` : ''}
                      </p>








                      <br><br><br>
                      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 18px; font-weight: lighter; margin: 0; margin-bottom: 15px;">
                        Have any questions, comments, or concerns? <br>
                                                Just reply to this email!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- END MAIN CONTENT AREA -->
          </table>

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="bottom" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; max-width: 100%; width: 100%; background-color: #407682; border-radius: 0 0 15px 15px;" width="100%" bgcolor="#407682">
            <tbody>
              <tr>
                <td align="center" style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                    <tbody>
                      <tr>
                        <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; border-radius: 5px; text-align: center; vertical-align: middle; width: 200px;" width="200" align="center" valign="middle"> <a href="https://tuxedocupcakes.com/" target="_blank" rel="noopener noreferrer" style="border-radius: 5px; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-size: 18px; font-weight: 300; margin: 10px 0; text-decoration: none; text-transform: capitalize;">Website</a>
                        </td>
                        <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; border-radius: 5px; text-align: center; vertical-align: middle; width: 200px;" width="200" align="center" valign="middle">
                          <a href="https://tuxedocupcakes.com/instagram" target="_blank" rel="noopener noreferrer" style="border-radius: 5px; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-size: 18px; font-weight: 300; margin: 10px 0; text-decoration: none; text-transform: capitalize;"><img style="border: none; -ms-interpolation-mode: bicubic; min-width: 50px; max-width: 75px; margin: 10px; width: 10%;" src="https://tuxedocupcakes.com/images/instagram-logo-transparent.png"></a>
                        </td>
                        <td class="logo" style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; border-radius: 5px; text-align: center; vertical-align: middle; width: 100px;" width="100" align="center" valign="middle"> <a href="https://tuxedocupcakes.com/" target="_blank" rel="noopener noreferrer" style="border-radius: 5px; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-size: 18px; font-weight: 300; margin: 10px 0; text-decoration: none; text-transform: capitalize;"><img src="https://tuxedocupcakes.com/images/logo.png" width="300px" alt="Tuxedo Cupcakes Logo" style="border: none; -ms-interpolation-mode: bicubic; min-width: 50px; max-width: 75px; margin: 10px;"></a>
                        </td>
                        <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; border-radius: 5px; text-align: center; vertical-align: middle; width: 200px;" width="200" align="center" valign="middle"><a href="https://tuxedocupcakes.com/facebook" target="_blank" rel="noopener noreferrer" style="border-radius: 5px; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-size: 18px; font-weight: 300; margin: 10px 0; text-decoration: none; text-transform: capitalize;"><img style="border: none; -ms-interpolation-mode: bicubic; min-width: 50px; max-width: 75px; margin: 10px; width: 10%;" src="https://tuxedocupcakes.com/images/facebook-logo.png"></a>
                        </td>
                        <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; border-radius: 5px; text-align: center; vertical-align: middle; width: 200px;" width="200" align="center" valign="middle"> <a href="https://tuxedocupcakes.com/order" target="_blank" rel="noopener noreferrer" style="border-radius: 5px; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-size: 18px; font-weight: 300; margin: 10px 0; text-decoration: none; text-transform: capitalize;">Order</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- START FOOTER -->
          <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
              <tr>
                <td class="content-block" style="font-family: Verdana, Geneva, Tahoma, sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                  <span style="color: #9a9ea6; font-size: 12px; text-align: center;">Tuxedo Cupcakes - 118 Hillside Ave, Chatham, NJ 07928</span>
                  <br> This email was sent to you because you placed an order through
                  <a href="https://tuxedocupcakes.com" target="_blank" rel="noopener" style="text-decoration: underline; color: #9a9ea6; font-size: 12px; text-align: center;">tuxedocupcakes.com</a>
                </td>
              </tr>
            </table>
          </div>
          <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
        </div>
      </td>
      <td style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
    </tr>
  </table>
</body>

</html>`;
}
