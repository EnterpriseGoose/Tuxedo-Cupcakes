import Layout from '~/components/Layout';
import styles from './display.module.scss';
import CupcakeBox, { decodeBox } from '~/components/CupcakeBox/CupcakeBox';
import { useSearchParams } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

export default function Display() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [detailedTooltip, setDetailedTooltip] = createSignal(false);
  onMount(() => {
    setDetailedTooltip(true);
  });

  return (
    <Layout minimal>
      <div class={styles.display}>
        <CupcakeBox
          box={decodeBox({
            t: searchParams.t as string,
            f: searchParams.f as string,
          })}
          scale={2}
          detailedTooltip={detailedTooltip()}
        />
      </div>
    </Layout>
  );
}
