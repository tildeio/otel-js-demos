# (Unsuccessful) Reproduction for #5167

Issue: https://github.com/open-telemetry/opentelemetry-js/issues/5167

## Reproduction Steps

The code in packages/express-cjs is based on the [current docs][docs]
and can be used to attempt an reproduction of the issue:

1. `git clone https://github.com/tildeio/otel-js-demos.git`
2. `git checkout 5167-otel-service-name`
3. `pnpm install`
4. `cd packages/express-cjs`

Then, ...

## Without `OTEL_SERVICE_NAME`

1. `pnpm start`
2. Navigate to http://localhost:8080/rolldice
3. Refresh a few times
4. Observe that the traces logged to the console has the following:

   ```js
   {
     resource: {
       attributes: {
         'service.name': 'unknown_service:node',
         'telemetry.sdk.language': 'nodejs',
         'telemetry.sdk.name': 'opentelemetry',
         'telemetry.sdk.version': '1.29.0',
         // ...
       },
     },
   }
   ```

## With `OTEL_SERVICE_NAME`

1. `OTEL_SERVICE_NAME=foo-bar pnpm start`
2. Navigate to http://localhost:8080/rolldice
3. Refresh a few times
4. Observe that the traces logged to the console has the following:

   ```js
   {
     resource: {
       attributes: {
         'service.name': 'foo-bar',
         'telemetry.sdk.language': 'nodejs',
         'telemetry.sdk.name': 'opentelemetry',
         'telemetry.sdk.version': '1.29.0',
         // ...
       },
     },
   }
   ```

## Conclusion

Setting the `OTEL_SERVICE_NAME` environment variable appears to be working as
expected, and there are [tests][tests] confirming as much. If this is not
working, it is probably due to interactions specific to that environment and
more details (library versions, etc) would be needed to reproduce/diagnose the
issue.

[docs]: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
[tests]: https://github.com/open-telemetry/opentelemetry-js/blob/887ff1cd6e3f795f703e40a9fbe89b3cba7e88c3/experimental/packages/opentelemetry-sdk-node/test/sdk.test.ts#L738-L768
