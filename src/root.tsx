// @refresh reload
import { FileRoutes, Scripts, Html, Head, Body, Routes, Meta, ErrorBoundary } from "solid-start";
import { Suspense } from "solid-js";

import "./global-styles/global.scss";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
				<title>Tuxedo Cupcakes</title>
      </Head>
      <Body>
        <Suspense>
            <ErrorBoundary>
                <Routes>
                    <FileRoutes />
                </Routes>
            </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
