import {
  trace,
  context,
  ROOT_CONTEXT,
  SpanStatusCode,
} from "@opentelemetry/api";
import "./tracing";
import express, { Request, Response } from "express";
import healthcheck from "express-healthcheck";
import { fetchFromService } from "./internal-service-lib";

const app = express();
const PORT = 10115;
const tracer = trace.getTracer("default");

app.use(express.json());
app.use("/health", healthcheck());

app.post("/createPicture", async (req: Request, res: Response) => {
  return await tracer.startActiveSpan("Create Picture", async (createPictureSpan) => {
    try {
      createPictureSpan.addEvent("log-event", {
        "log.message": "Picture successfully created",
      });

      // record a slow starting span - link it to the parent span
      await tracer.startActiveSpan(
          "sleepy activity root span",
          {
            links: [
              {
                context: createPictureSpan.spanContext(),
              },
            ],
          },
          ROOT_CONTEXT,
          async (span) => {
            await fetchFromService("sleep", {
              method: "GET",
            });
            span.end();
          }
      );

      let phraseJSON: string, imageJSON: string;

      // Render image - check first, did we get a phrase in the request?
      const incomingPhraseText: string = req.body.phrase;

      if (incomingPhraseText) {
        // TODO - yes, this is where the invalid request bug will created... bad unescaped data in the input
        phraseJSON = `{ "phrase": "${incomingPhraseText}" }`;
        const imageResponse = await fetchFromService("image-picker");
        imageJSON = imageResponse.ok ? await imageResponse.text() : "{}";
      } else {
        const [phraseResponse, imageResponse] = await Promise.all([
          fetchFromService("phrase-picker"),
          fetchFromService("image-picker"),
        ]);
        phraseJSON = phraseResponse.ok ? await phraseResponse.text() : "{}";
        imageJSON = imageResponse.ok ? await imageResponse.text() : "{}";
      }

      createPictureSpan?.setAttributes({
        "app.phraseResponse": phraseJSON,
        "app.imageResponse": imageJSON,
      });

      const phraseResult = JSON.parse(phraseJSON);
      const imageResult = JSON.parse(imageJSON);

      createPictureSpan?.setAttributes({
        "app.phraseResult": phraseResult.phrase,
        "app.imageResult": imageResult.imageUrl,
      });
      const response = await fetchFromService("meminator", {
        method: "POST",
        body: {
          ...phraseResult,
          ...imageResult,
        },
      });

      if (!response.ok) {
        throw new Error(
            `Failed to fetch picture from meminator: ${response.status} ${response.statusText}`
        );
      }
      if (response.body === null) {
        throw new Error(
            `Failed to fetch picture from meminator: ${response.status} ${response.statusText}`
        );
      }

      res.contentType("image/png");
      // Read the response body as binary data
      const reader = response.body.getReader();
      // Stream the chunks of the picture data to the response as they are received
      while (true) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        res.write(value);
      }
      console.log(`about to end "span"`);
      res.end();
    } catch (error) {
      createPictureSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      createPictureSpan.recordException(error as Error);
      createPictureSpan.addEvent("error-event", {
        error: (error as Error).message,
      });

      // to handle TS type safety for adding span statuses
      if (error instanceof Error) {
        createPictureSpan.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        createPictureSpan.recordException(error);
      } else {
        createPictureSpan.setStatus({
          code: SpanStatusCode.ERROR,
          message: "some non-error message" + error,
        });
      }
      console.error("Error creating picture:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      createPictureSpan.end();
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// This is an asynchronous fuction for creating a custom span with a new trace. Remove comment to use this as helper function to create async tasks
app.get("/sleep", async (req: Request, res: Response) => {
  for (let i = 0; i < 5; i++) {
    const childSpan = tracer.startSpan("sleepy child span");
    childSpan?.setAttributes({ "app.timePassed": i });
    console.log("time passes %d", i);
    await new Promise((resolve) => setTimeout(resolve, 400)); // let some time pass.
    childSpan.end();
  }
  res.status(200).send("Awake time!\r\n");
});
