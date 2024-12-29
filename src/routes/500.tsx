import Layout from '~/components/Layout';
import styles from './500.module.scss';

export default function ServerError() {
  return (
    <Layout hideFooter>
      <div class={styles.error}>
        <h1>500</h1>
        <p>
          We seem to have encountered a server error. <br /> You can try using
          the navigation at the top to get back, or wait a little and try again.
        </p>
        <p>
          If this error persists, please contact me at{' '}
          <a
            href="mailto:olive@tuxedocupcakes.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            olive@tuxedocupcakes.com
          </a>{' '}
          so I can resolve the issue.
        </p>
      </div>
    </Layout>
  );
}
