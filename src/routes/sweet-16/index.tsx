import Layout from '~/components/Layout';
import styles from './index.module.scss';

export default function Sweet16() {
  return (
    <Layout desc="To celebrate the 16th year of the Chatham Farmers' Market (and my turning 16), I am hosting a Sweet 16 Cupcake Bracket this year! Each week, I will bring two different specials to the market, and anyone who buys and tries both flavors will be able to vote on the better flavor. The winning flavor of each week will move on to the next round until we end up with one winning flavor!">
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Sweet 16 Cupcake Bracket</h2>
          <p>
            To celebrate the 16th year of the Chatham Farmers' Market (and my
            turning 16), I am hosting a Sweet 16 Cupcake Bracket this year!
            <br /> <br />
            Each week, I will bring two different specials to the market, and
            anyone who buys and tries both flavors will be able to vote on the
            better flavor.
            <br /> <br />
            The winning flavor of each week will move on to the next round until
            we end up with one winning flavor!
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Bracket</h3>
          <p>
            This week is the the ninth week of the bracket: Chocolate Matcha vs. Salted Caramel Cashew
          </p>

          <br />
          <a
            href="/images/bracket.svg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/bracket.svg"
              class={styles.bracket}
              alt="Sweet 16 Cupcake Bracket image"
            />
            <p class={styles.mobileHint}>(Tap to expand)</p>
          </a>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.three}`}>
          <h3>FAQs</h3>
          <h4>How do I vote?</h4>
          <p>
            You can either vote in person at the market, or, if you take home
            both of the specials, I will put a ticket in your box so you can
            vote from home! Voting from home ends at 11:59 on the Thursday
            before the following market. <br /> <br />
            You can only vote if you've tried both of the flavors.
          </p>
          <br />
          <h4>How does the bracket work?</h4>
          <p>
            Each week I will bring in two specials and whichever special wins
            will advance. After 8 markets, I will start to bring back the
            winning specials, until there is one winner.
            <br /> <br />I will announce the winner of each week on{' '}
            <a
              href="https://www.instagram.com/tuxedo_cupcakes/"
              target="_blank"
              rel="noopener noreferrer"
            >
              my instagram
            </a>
          </p>
          <br />
        </div>
        <div class={`${styles.section} ${styles.four}`}>
          <h4>
            Any other questions? Contact me at
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
      </div>
    </Layout>
  );
}
