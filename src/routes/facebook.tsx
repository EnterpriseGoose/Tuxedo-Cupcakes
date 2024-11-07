import { Meta } from '@solidjs/meta';
import { onMount } from 'solid-js';

export default function Instagram() {
  onMount(() => {
    setTimeout(() => {
      window.location.href =
        'https://www.facebook.com/profile.php?id=61555665201272';
    }, 1000);
  });

  return (
    <>
      <Meta
        http-equiv="refresh"
        content="0; URL=fb://profile/61555665201272?id=61555665201272"
      />
      <Meta
        http-equiv="refresh"
        content="0; URL=intent://profile/61555665201272#Intent;package=com.facebook.katana;scheme=fb;end?id=61555665201272"
      />
      <Meta
        http-equiv="refresh"
        content="1; URL=https://www.facebook.com/profile.php?id=61555665201272"
      />
    </>
  );
}
