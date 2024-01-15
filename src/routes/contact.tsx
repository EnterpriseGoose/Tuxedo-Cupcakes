import Layout from '~/components/Layout';
import styles from './contact.module.scss';

export default function Contact() {
  return (
    <Layout hideFooter desc='Contant us about placing an order or any other questions or comments you may have.'>
      <div class={styles.contact}>
        <h2>Contact</h2>
        <h4>
          Contact us at
          <br />
          <a
            href="mailto:hello@tuxedocupcakes.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            hello@tuxedocupcakes.com
          </a>
        </h4>
      </div>
    </Layout>
  );
}
