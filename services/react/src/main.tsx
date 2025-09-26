// add automatic instrumentation for web first
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import {getSession} from './session-management'; // import session management

const sdk = new HoneycombWebSDK({
    apiKey: 'your ingest api key', // your API key goes here
    serviceName: 'react',
    instrumentations: [
        getWebAutoInstrumentations()
    ],
// configure the sessionProvider property by implementing the getSessionId method
    sessionProvider: {
        getSessionId: () => { return getSession(); }
    }
});
sdk.start();
// React createRoot goes here
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


