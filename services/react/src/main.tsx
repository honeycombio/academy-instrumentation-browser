import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// First, install the `@honeycombio/opentelemetry-web` and `@opentelemetry/auto-instrumentations-web` packages in `services/react`.
// Then, import the `HoneycombWebSDK` class and `getWebAutoInstrumentations` function into the main entry point of the application.
import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

// Next, configure the `HoneycombWebSDK`. 
// Add your API key in the config to send frontend telemetry to Honeycomb. 
// If you have not already, add your API key in `.env` to send backend telemetry to Honeycomb. This is how you see end-to-end traces!
// After configuring the SDK, rerun the app in the root directory. Then see the traces in Honeycomb.
const sdk = new HoneycombWebSDK({
    apiKey: 'your ingest api key',
    serviceName: 'react',
    instrumentations: [
        getWebAutoInstrumentations()
    ],
});
sdk.start();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
