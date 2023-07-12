import Layout from '~/components/Layout';
import styles from './newsletter.module.scss';
import EmailForm from '~/components/EmailForm';

export default function Newsletter() {
  return (
    <Layout hideFooter>
      <div class={styles.newsletter}>
        <h2>Newsletter</h2>
        <p>
          Sign up for the Tuxedo Cupcakes newsletter to get notified of special
          events, weekly Farmers' Market flavors, virtual markets and more!
        </p>
        <EmailForm />
      </div>
    </Layout>
  );
}
