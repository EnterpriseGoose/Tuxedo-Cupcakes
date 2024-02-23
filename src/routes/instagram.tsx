import { onMount } from 'solid-js';
import { Head } from 'solid-start';

export default function Instagram() {
  onMount(() => {
    setTimeout(() => {
      window.location.href = 'https://www.instagram.com/tuxedo_cupcakes/';
    }, 1000);
  });

  return (
    <Head>
      <meta
        http-equiv="refresh"
        content="0; URL=instagram://user?username=tuxedo_cupcakes"
      />
      <meta
        http-equiv="refresh"
        content="0; URL=intent://www.instagram.com/tuxedo_cupcakes/#Intent;package=com.instagram.android;scheme=https;end"
      />
      <meta
        http-equiv="refresh"
        content="1; URL=https://www.instagram.com/tuxedo_cupcakes/"
      />
    </Head>
  );
}
