import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import config from "./config";

const sentryDsn = config.getSentryDsn();

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
    release: "1.0.0",
    environment: config.getSentryEnvironment(),
    integrations: [new BrowserTracing()]
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
