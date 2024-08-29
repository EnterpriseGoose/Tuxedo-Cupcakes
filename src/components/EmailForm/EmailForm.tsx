import { useSearchParams } from '@solidjs/router';
import styles from './EmailForm.module.scss';
import { Match, Switch } from 'solid-js';
import { createClient } from '@supabase/supabase-js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function EmailForm() {
  const [searchParams, setSearchparams] = useSearchParams();

  return (
    <div class={styles.emailForm}>
      <form
        action=""
        method="post"
        onsubmit={async (event) => {
          event.preventDefault();
          let email = (event.target.children[0] as HTMLInputElement).value;
          const supabase = createClient(
            'https://rxznihvftodgtjdtzbyr.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
          );
          let response = await supabase.from('emailList').insert({ email });
          console.log(response.status);
          setSearchparams({ email: response.status });
          (event.target.children[0] as HTMLInputElement).value = '';

					event.submitter.classList.add("submitted");
					await sleep(2000);
					event.submitter.className = "button";
        }}
      >
        <input
          class={styles.email}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />{' '}
        <input
          class="button"
          type="submit"
          id="button"
          value="Sign Up"
        />
      </form>
      <Switch>
        <Match when={searchParams.email === '201'}>Email added to list!</Match>
        <Match when={searchParams.email === '409'}>
          Email is already on list.
        </Match>
        <Match
          when={
            searchParams.email !== '201' &&
            searchParams.email !== '409' &&
            searchParams.email !== undefined
          }
        >
          An unknown error occurred. Try again.
        </Match>
      </Switch>
    </div>
  );
}
