import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
// First, import the `getSession` function from the `session-management.ts` file.
import {getSession} from './session-management';

const sdk = new HoneycombWebSDK({
    apiKey: 'your ingest api key',
    serviceName: 'react',
    instrumentations: [
        getWebAutoInstrumentations()
    ]
    // Then, configure the `sessionProvider` property by implementing the `getSessionId` method. 
    // This calls our `getSession` function to return a valid `session.id`. 
    // This method will store this `session.id` in the browser's `sessionStorage` and reuse it across multiple "GO" clicks, page loads, and route changes, or generate a new one when needed.
    sessionProvider: {
    getSessionId: () => { return getSession(); }
    } 
});
sdk.start();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
