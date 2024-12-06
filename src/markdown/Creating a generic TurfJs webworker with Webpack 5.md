---
created: 2022-01-21T21:29:00+11:00
section: blog
tags: [TurfJS]
title: Creating a generic TurfJS webworker with Webpack 5
---

Turf.js is a great JavaScript library for doing geospatial analysis and manipulation directly in the browser. But it does have a downside; all of it's functions are synchronous, halting the whole webpage when processing large amounts of data.

---

[Web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) are a way of running scripts off the main JS thread. this allows us to run a [Turf.js](https://turfjs.org/) function without stalling the main thread. This allows both the use of loading messages/spinners and for the user to do other things while it's running.

Usually getting other libraries into a webworker can be a bit _tricky_, unless you use [Webpack](https://webpack.js.org/). Thankfully (for me), I usually use [Next.js](https://nextjs.org/) when making my sites and that uses Webpack 5.

## Example

First up, let's look at an example!

I created [this example website](https://turfjs-webworker-example.vercel.app/). It's pre-loaded with 10k points randomly distributes around Australia. Under the map, there are three buttons: Run buffer Synchronously, Run buffer Async, and Clear buffer.

Clicking on the _Run buffer Synchronously_ button will run a **Buffer** process on the 10k points. This process should take under a second, depending on your computer. Doing this Synchronously stops the user from interacting with the page and stops any animations on the page.

Clicking on the _Run buffer Async_ button will also run a **Buffer** process on the 10k points. This does take longer to process, almost 3 times on my computer. But it doesn't stop the page from animating or accepting user input.

## Creating the Web Worker

To make this work, I call a function called `addEventListener` in it's own file. The function takes 2 values: the string `"message"` and a callback function. The callback function receives an input and posts a message back to where it was called.

For this I import the full TurfJS library, then listen for a message that contains the name of a TurfJS function, and an array containing the function's arguments in order.

```ts static
import * as turf from "@turf/turf";

type TurfFunction = {
  functionName: string;
  params: any[];
};

addEventListener("message", ({ data }: MessageEvent<TurfFunction>) => {
  // @ts-ignore
  postMessage(turf[data.functionName].apply(null, data.params));
});
```

## Calling the Web Worker

To call the Web Worker, I've created a function that handles doing an asynchronous Buffer. It takes the GeoJSON that you want to preform the operation on and a callback function to return the result.

There are 3 things that the function does:

1. Create the Web Worker
2. Send the the worker the details is needs to do the operation.
3. Have the web worker listen for the when the work is finished.

```ts static
type AsyncBufferArgs = {
  geojson: FeatureCollection<Geometry | GeometryCollection, Properties>;
  onComplete: (FeatureCollection<Geometry | GeometryCollection, Properties> | undefined) => void;
}

export const AsyncBuffer = async ({ geojson, onComplete }: AsyncBufferArgs) => {
  // Create the Web Worker
  const worker = new Worker(
    new URL("/src/workers/turf.worker.ts", import.meta.url)
  );

  // Listen for the worker's response
  worker.onmessage = ({ data }: MessageEvent<AllGeoJSON | null>) => {
    worker.terminate();
    if (data !== null) {
      //@ts-ignore
      onComplete(data);
    } else {
      onComplete(undefined);
    }
  };

  // Create the Buffer Config
  const bufferConfig: TurfFunction = {
    functionName: "buffer",
    params: [
      geojson,
      10,
      {
        units: 'kilometers',
      },
    ],
  };

  // Send the Buffer Config to the Web Worker
  worker.postMessage(bufferConfig);
};
```

Now, you could make a function that's more generic, but the geospatial inputs for the function are quite different form one function to another and with TypeScript (that I'm using here) that could be a massive headache.

But apart form that, you now have a working implementation for TurfJS in a webworker!
