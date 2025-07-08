import { trace, context, ROOT_CONTEXT, SpanStatusCode } from '@opentelemetry/api';
import "./tracing"
import express, { Request, Response } from 'express';
import healthcheck from 'express-healthcheck';
import { fetchFromService } from "./internal-service-lib";

const app = express();
const PORT = 10115;
const tracer = trace.getTracer('default')

app.use(express.json());
app.use('/health', healthcheck());

app.post('/createPicture', async (req: Request, res: Response) => {
    const span = trace.getActiveSpan();
    const createPictureSpan = tracer.startSpan('create picture');
    // TS error type helper function
    const getErrorMessage = (error: unknown) => {
        if(error instanceof Error) error.message
        return "some error that is not an Error" + String(error)
    }

    try {
           createPictureSpan.addEvent('log-event', {'log.message': 'Picture successfully created'});
            let options = {}
           if(createPictureSpan !== undefined){
               options = {
                   links: [
                       {
                       context: createPictureSpan.spanContext(),
                       },
                   ],
               };  
           }
    
            tracer.startActiveSpan("sleepy activity root span", options, ROOT_CONTEXT, (span) => {
            fetchFromService('sleep', { 
                method: "GET"
            });
            span.end()
            });

        const [phraseResponse, imageResponse] = await Promise.all([
            fetchFromService('phrase-picker'),
            fetchFromService('image-picker')
        ]);
        const phraseText = phraseResponse.ok ? await phraseResponse.text() : "{}";
        const imageText = imageResponse.ok ? await imageResponse.text() : "{}";
        span?.setAttributes({ "app.phraseResponse": phraseText, "app.imageResponse": imageText });
        const phraseResult = JSON.parse(phraseText);
        const imageResult = JSON.parse(imageText);
        createPictureSpan?.setAttributes({ "app.phraseResult": phraseResult, "app.imageResult": imageResult})
        const response = await fetchFromService('meminator', {
            method: "POST",
            body: {
                ...phraseResult, ...imageResult
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch picture from meminator: ${response.status} ${response.statusText}`);
        }
        if (response.body === null) {
            throw new Error(`Failed to fetch picture from meminator: ${response.status} ${response.statusText}`);
        }

        res.contentType('image/png');
        // Read the response body as binary data
        const reader = response.body.getReader();
        // Stream the chunks of the picture data to the response as they are received
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            res.write(value);
        }
        span?.end()
        res.end()

    } catch (error) {
        createPictureSpan.setStatus({ code: SpanStatusCode.ERROR });
        createPictureSpan.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
        createPictureSpan.recordException(error as Error);
        createPictureSpan.addEvent('error-event', { error: (error as Error).message });

        // to handle TS type safety for adding span statuses
        if (error instanceof Error) {
        createPictureSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
        createPictureSpan.recordException(error)
    } else {
        createPictureSpan.setStatus({ code: SpanStatusCode.ERROR, message: "some non-error message" + error })
}
        console.error('Error creating picture:', error);
        res.status(500).send('Internal Server Error');
    }
    createPictureSpan.end()
 });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// This is an asynchronous fuction for creating a custom span with a new trace. Remove comment to use this as helper function to create async tasks
  app.get("/sleep", async (req: Request, res: Response) => {
    for(let i = 0; i < 5; i++){
        const childSpan = tracer.startSpan('sleepy child span') 
        childSpan?.setAttributes({ "app.timePassed": i})
        console.log("time passes %d", i)
        await new Promise(resolve => setTimeout(resolve, 400)); // let some time pass.
        childSpan.end()
   }
    res.status(200).send("Awake time!\r\n")
  });