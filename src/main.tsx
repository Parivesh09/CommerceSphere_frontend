import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { monitoring } from './services/monitoring';


monitoring.initialize();


const SentryApp = import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true'
  ? Sentry.withProfiler(App)
  : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryApp />
  </StrictMode>
);
