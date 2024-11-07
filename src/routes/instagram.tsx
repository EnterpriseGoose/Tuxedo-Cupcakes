import { Meta } from '@solidjs/meta';
import { onMount } from 'solid-js';

export default function Instagram() {
  onMount(() => {
    setTimeout(() => {
      window.location.href = 'https://www.instagram.com/tuxedo_cupcakes/';
    }, 1000);
  });

  return (
    <>
      <Meta
        http-equiv="refresh"
        content="0; URL=instagram://user?username=tuxedo_cupcakes"
      />
      <Meta
        http-equiv="refresh"
        content="0; URL=intent://www.instagram.com/tuxedo_cupcakes/#Intent;package=com.instagram.android;scheme=https;end"
      />
      <Meta
        http-equiv="refresh"
        content="1; URL=https://www.instagram.com/tuxedo_cupcakes/"
      />
    </>
  );
}
