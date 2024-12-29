import Layout from '~/components/Layout';
import styles from './404.module.scss';

export default function FourOFour() {
  return (
    <Layout hideFooter>
      <div class={styles.error}>
        <h1>404</h1>
        <p>
          You seem to have stumbled upon a page that does not exist. <br /> Try
          using the navigation at the top to get back to the right place!
        </p>
        <p>
          If you very much believe that there should be a page here, you can try
          contacting me at{' '}
          <a
            href="mailto:olive@tuxedocupcakes.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            olive@tuxedocupcakes.com
          </a>
        </p>
      </div>
    </Layout>
  );
}
