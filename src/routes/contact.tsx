import Layout from '~/components/Layout';
import styles from './contact.module.scss';

export default function Contact() {
  return (
    <Layout hideFooter desc='Contant me about placing an order or any other questions or comments you may have.'>
      <div class={styles.contact}>
        <h2>Contact</h2>
        <h4>
          Contact me at
          <br />
          <a
            href="mailto:oliver@tuxedocupcakes.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            oliver@tuxedocupcakes.com
          </a>
        </h4>
      </div>
    </Layout>
  );
}
