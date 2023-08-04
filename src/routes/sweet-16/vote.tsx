import { useSearchParams } from '@solidjs/router';
import { Match, Switch, createEffect, createSignal } from 'solid-js';
import { createClient } from '@supabase/supabase-js';
import Layout from '~/components/Layout';
import styles from './vote.module.scss';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let verifyCode = async (event) => {
  let target = event.target as HTMLInputElement;
  let successElem = target.parentElement.getElementsByClassName('codeValid')[0];
  let code = target.value;
  target.value = code.replaceAll(/\D/g, '');
  if (parseInt(code).toString().length !== 6) {
    successElem.textContent = '';
    let voteOptions = document.getElementsByClassName('voteOption');
    voteOptions[0].className = `voteOption ${styles.disabled}`;
    (voteOptions[0].previousElementSibling as HTMLInputElement).disabled = true;
    voteOptions[1].className = `voteOption ${styles.disabled}`;
    (voteOptions[1].previousElementSibling as HTMLInputElement).disabled = true;
    (document.getElementById('submit') as HTMLInputElement).disabled = true;
    return;
  }
  const supabase = createClient(
    'https://rxznihvftodgtjdtzbyr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
  );
  let { data, error } = await supabase.rpc('test_voteid', {
    voteid: parseInt(code),
  });
  if (error) {
    let errorNode = document.createElement('p');
    errorNode.textContent =
      'Unknown error occured when checking code: ' +
      error.code +
      '\nTry refreshing and trying again';
    target.parentElement.before(errorNode);
  }
  if (data) {
    event.target.setAttribute('valid', 'true');
    successElem.textContent = '✓';
    let voteOptions = document.getElementsByClassName('voteOption');
    voteOptions[0].className = `voteOption`;
    (voteOptions[0].previousElementSibling as HTMLInputElement).disabled =
      false;
    voteOptions[1].className = `voteOption`;
    (voteOptions[1].previousElementSibling as HTMLInputElement).disabled =
      false;
    (document.getElementById('submit') as HTMLInputElement).disabled = false;
  } else {
    event.target.setAttribute('valid', 'false');
    successElem.textContent = '✖';
    let voteOptions = document.getElementsByClassName('voteOption');
    voteOptions[0].className = `voteOption ${styles.disabled}`;
    (voteOptions[0].previousElementSibling as HTMLInputElement).disabled = true;
    voteOptions[1].className = `voteOption ${styles.disabled}`;
    (voteOptions[1].previousElementSibling as HTMLInputElement).disabled = true;
    (document.getElementById('submit') as HTMLInputElement).disabled = true;
  }
};

export default function Vote() {
  const [searchParams, setSearchparams] = useSearchParams();
  const [status, setStatus] = createSignal();
  let codeElem: HTMLInputElement;

  createEffect(() => {
    verifyCode({ target: codeElem });
  });

  const dotw = new Date(Date.now()).getDay();

  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Sweet 16 Voting</h2>
          <Switch>
            <Match when={dotw === 5}>
              <div class={styles.voteForm}>
                Voting is currently closed. Come back tomorrow to vote on this
                week's flavors.
              </div>
            </Match>
            <Match when={true}>
              <div class={styles.voteForm}>
                <form
                  action=""
                  method="post"
                  onsubmit={async (event) => {
                    event.preventDefault();
                    const data = new FormData(event.target as HTMLFormElement);
                    let code, vote;
                    for (const entry of data) {
                      if (entry[0] === 'code') code = entry[1];
                      if (entry[0] === 'vote') {
                        vote =
                          entry[1] === 'one'
                            ? event.target.getElementsByClassName(
                                'voteOption'
                              )[0].textContent
                            : event.target.getElementsByClassName(
                                'voteOption'
                              )[1].textContent;
                      }
                    }
                    console.log({ code, vote });
                    const supabase = createClient(
                      'https://rxznihvftodgtjdtzbyr.supabase.co',
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
                    );
                    let response = await supabase
                      .from('votes')
                      .insert({ id: code, vote });
                    console.log(response.status);
                    setStatus(response.status);

                    const elementsGotten =
                      event.target.getElementsByTagName('input');
                    elementsGotten[0].value = '';
                    elementsGotten[1].checked = false;
                    elementsGotten[2].checked = false;
                    verifyCode({ target: codeElem });
                    event.submitter.classList.add(styles.submitted);
                    await sleep(2000);
                    event.submitter.className = styles.submit;
                  }}
                >
                  <div class={styles.codeVerify}>
                    <label for="code">Code:</label>
                    <input
                      class={styles.code}
                      type="text"
                      name="code"
                      id="code"
                      placeholder="000000"
                      minLength={6}
                      maxlength={6}
                      spellcheck={false}
                      value={searchParams.code || ''}
                      required
                      onInput={verifyCode}
                      ref={codeElem}
                    />
                    <label for="code" class="codeValid"></label>
                  </div>
                  <div class={styles.vote}>
                    <input
                      type="radio"
                      id="one"
                      name="vote"
                      required
                      value="one"
                    />
                    <label for="one" class={`voteOption ${styles.disabled}`}>
                      <img src="/images/cupcake-graphics/chocolate-raspberry.svg" />
                      Chocolate Raspberry
                    </label>
                    <input
                      type="radio"
                      id="two"
                      name="vote"
                      required
                      value="two"
                    />
                    <label for="two" class={`voteOption ${styles.disabled}`}>
                      <img src="/images/cupcake-graphics/mint-chocolate-chip.svg" />
                      Mint Chocolate Chip
                    </label>
                  </div>
                  <input
                    class={styles.submit}
                    type="submit"
                    value={'Submit Vote'}
                    id="submit"
                  />
                </form>
                <Switch>
                  <Match when={status() === 201}>
                    Your vote has been sumbitted!
                  </Match>
                  <Match when={status() !== undefined}>
                    An unknown error occurred. Try again.
                  </Match>
                </Switch>
              </div>
            </Match>
          </Switch>
        </div>
        <div class={`${styles.section} ${styles.two}`}></div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.four}`}>
          <h4>
            Any questions? Contact me at
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
