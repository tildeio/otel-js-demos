# Reproduction for #4888

Issue: https://github.com/open-telemetry/opentelemetry-js/issues/4888

## Reproduction Steps

The problematic pattern pointed out in the issue can be easily reproduced
and distilled down without involving the instrumentation code, so this is a
standalone demo that doesn't actually use any of the Otel packages.

The code in packages/fetch-memory-demo is an express app that:

1. Serves the `index.html` which hosts the reproduction
2. Serves an `/infinite-stream` endpoint that continuously write large chunks
   to the response without closing it to facilitate the demo

_Warning_: The demo (when run with the "make unused response clone" checkbox
checked) is designed to force the browser into holding on to large amounts of
memory. This is not harmful per se, and in my experience with Chrome at least,
it only crashes the tab, but YMMV with other browsers, and you may lose work
because of this!

1. `git clone https://github.com/tildeio/otel-js-demos.git`
2. `git checkout 4888-fetch-memory-leak`
3. `pnpm install`
4. `cd packages/fetch-memory-demo`
5. `pnpm start`
6. Navigate to http://localhost:8080/
7. Select "make unused response clone" to reproduce
8. "Start" and wait for your tab to crash!
