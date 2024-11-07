import Layout from '~/components/Layout';
import styles from './success.module.scss';
import axios from 'axios';
import { getPaypalAuth } from '../server';
import { useSearchParams } from '@solidjs/router';
import { createSignal, For, onMount, Show } from 'solid-js';
import CupcakeBox from '~/components/CupcakeBox';
import { decodeBox, encodeBox } from '~/components/CupcakeBox/CupcakeBox';
import { createClient } from '@supabase/supabase-js';

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
      const supabase = createClient(
        'https://rxznihvftodgtjdtzbyr.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
      );

      const orderData = JSON.parse(
        window.localStorage.getItem('orderData')
      ).order;
      if (orderData) {
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
            (currString, flavor) =>
              currString + flavor[0] + ' ×' + flavor[1] + `, `,
            ''
          ),
          url:
            window.location.origin +
            `/order/display?t=${encodeBox(box).t}&f=${encodeBox(box).f}`,
        }));

        let response = await supabase.from('orders').insert({
          id: searchParams.token,
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
      }

      if (orderData.info.save) {
        window.localStorage.setItem(
          'orderData',
          JSON.stringify({ order: { info: orderData.info } })
        );
      } else {
        window.localStorage.setItem('orderData', '{}');
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
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}`,
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
