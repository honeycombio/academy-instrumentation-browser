// install npm packages in services/react before adding any instrumentation code here
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web'; // import the HoneycombWebSDK class
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'; //import getWebAutoInstrumentations function
// configure the HoneycombWebSDK
const sdk = new HoneycombWebSDK({
    apiKey: 'your ingest api key', // your API key goes here
    serviceName: 'react',
    instrumentations: [
        getWebAutoInstrumentations()
    ]
});
sdk.start();
// React createRoot goes here
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// once SDK is configured, rerun the app to see traces in Honeycomb
