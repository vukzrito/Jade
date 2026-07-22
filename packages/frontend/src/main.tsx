import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './providers/AppProviders';
import { Router } from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <Router />
    </AppProviders>
  </React.StrictMode>,
);
