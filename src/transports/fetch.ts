import fetch from '@system.fetch'
import { createTransport } from '@sentry/core';
import type { Transport, TransportMakeRequestResponse, TransportRequest } from '@sentry/types';
import { rejectedSyncPromise } from '@sentry/utils';

import type { QuickAppTransportOptions } from './types';
import type { FetchImpl } from './utils';

export function makeFetchTransport(
  options: QuickAppTransportOptions,
  nativeFetch: FetchImpl = fetch.fetch,
): Transport {

  function makeRequest(request: TransportRequest): PromiseLike<TransportMakeRequestResponse> {
    console.log(request.body)
    try {
      return nativeFetch({
        url: 'options.url',
        data: request.body,
        method: 'POST',
        header: options.headers,
      }).then(response => {
        return {
          statusCode: response.status,
          headers: {
            'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
            'retry-after': response.headers.get('Retry-After'),
          },
        };
      })
    } catch (e) {
      return rejectedSyncPromise(e);
    }
  }

  return createTransport(options, makeRequest);
}
