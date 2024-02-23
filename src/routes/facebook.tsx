import { onMount } from 'solid-js';
import { Head } from 'solid-start';

export default function Instagram() {
  onMount(() => {
    setTimeout(() => {
      window.location.href =
        'https://www.facebook.com/profile.php?id=61555665201272';
    }, 1000);
  });

  return (
    <Head>
      <meta
        http-equiv="refresh"
        content="0; URL=fb://profile/61555665201272?id=61555665201272"
      />
      <meta
        http-equiv="refresh"
        content="0; URL=intent://profile/61555665201272#Intent;package=com.facebook.katana;scheme=fb;end?id=61555665201272"
      />
      <meta
        http-equiv="refresh"
        content="1; URL=https://www.facebook.com/profile.php?id=61555665201272"
      />
    </Head>
  );
}
