import Layout from '~/components/Layout';
import styles from './order.module.scss';
import { Match, Show, Switch, createEffect, createSignal } from 'solid-js';

interface FlavorData {
  flavor: string;
  regular: boolean;
  quantity: bigint;
}

interface FormData {
  date: Date;
  flavors: FlavorData[];
  email: string;
  phone?: string;
}

export default function Order() {
  const [formState, setformState] = createSignal(0);
  const [completedPage, setCompletedPage] = createSignal(false);

  const [formData, setFormData] = createSignal<FormData>({
    date: new Date(),
    flavors: [],
    email: '',
  });

  var dateInput: HTMLInputElement;

  createEffect(() => {
    let progress = formState();
    if (completedPage()) progress++;
    document
      .getElementById('progress')
      .style.setProperty('--progress', (progress / 3).toString());
  });

  return (
    <Layout hideFooter desc="Place an order today!">
      <div class={styles.order}>
        <Switch>
          <Match when={formState() === 0}>
            <h2>Place an order today!</h2>
            <h4>When would you like to pickup your order?</h4>
            <input
              ref={dateInput}
              oninput={(e) => {
                console.log(e.target.value);
                if (e.target.value == 'next') {
                  document.getElementById('nextButton').disabled = false;
                  setCompletedPage(true);
                } else {
                  document.getElementById('nextButton').disabled = true;
                  setCompletedPage(false);
                }
              }}
            ></input>
          </Match>
        </Switch>
        <Show when={formState() < 3}>
          <div class={styles.navigation}>
            <Show when={formState() > 0}>
              <button
                class={styles.backButton}
                id="backButton"
                onClick={() => {
                  setformState(formState() - 1);
                }}
              >
                ← Back
              </button>
            </Show>
            <button
              disabled
              class={styles.nextButton}
              id="nextButton"
              onClick={() => {
                setformState(formState() + 1);
                setCompletedPage(false);
              }}
            >
              Next →
            </button>
          </div>
        </Show>
        <div class={styles.progressBar}>
          <div class={styles.progress} id="progress" />
        </div>
      </div>
    </Layout>
  );
}
