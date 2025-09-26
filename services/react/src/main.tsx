// add automatic instrumentation for web first
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { features } from './features'; // import the features object

const sdk = new HoneycombWebSDK({
    apiKey: 'your ingest api key', // your API key goes here
    serviceName: 'react',
    instrumentations: [
        getWebAutoInstrumentations()
    ],
    resourceAttributes: { // Data in this object is applied to every trace emitted.
    "feature_flag.key": "ALLOW_USER_QUESTIONS", // Specific to your app.
    "feature_flag.result.variant": features.ALLOW_USER_QUESTIONS, // Specific to your app.// specify extra attributes through the resourceAttributes configuration option
    },
  });
sdk.start();
// React createRoot goes here
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

