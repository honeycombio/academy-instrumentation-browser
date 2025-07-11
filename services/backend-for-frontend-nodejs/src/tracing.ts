// tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
// import { ATTR_SERVICE_NAMESPACE, ATTR_SERVICE_INSTANCE_ID } from './semconv';
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";

diag.setLogger(new DiagConsoleLogger(),DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
        resource: resourceFromAttributes({
            [ "service.namespace" ]: "yourNameSpace",
            [ ATTR_SERVICE_VERSION ]: "1.0",
            [ "service.instance.id" ]: "my-instance-id-1",
          }),
    traceExporter,
    spanProcessors: [
        // new ConfigurationSpanProcessor(),
        new BatchSpanProcessor(traceExporter)], // INSTRUMENTATION: report global configuration on every span
    instrumentations: [getNodeAutoInstrumentations(
        { '@opentelemetry/instrumentation-fs': { enabled: true } } // the fs tracing might be interesting here!
    )]
});

sdk.start();

console.log("Started OpenTelemetry SDK");

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
});
