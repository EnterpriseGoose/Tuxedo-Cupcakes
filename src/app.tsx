// @refresh reload

import { Suspense, ErrorBoundary } from 'solid-js';
import './global-styles/global.scss';

import NoPage from './routes/404';
import { Route, Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import ServerError from './routes/500';

export default function Root() {
  return (
    <Suspense>
      {/* <ErrorBoundary fallback={ServerError}> */}
      <Router>
        <FileRoutes />
        <Route path="*" component={NoPage} />
      </Router>
      {/* </ErrorBoundary> */}
    </Suspense>
  );
}
