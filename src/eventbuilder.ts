import type { Event, EventHint, StackFrame, StackParser } from '@sentry/types';
import { addExceptionMechanism, resolvedSyncPromise } from '@sentry/utils';

export function eventFromQuickAppError(
  stackParser: StackParser,
  exception: unknown,
  hint?: EventHint
): PromiseLike<Event> {
  const frames = parseStackFrames(stackParser, exception as Error);
  const event: Event = {
    exception: {
      values: [{
        ...extractTypeAndValue(exception as Error),
        stacktrace: { frames }
      }],
    },
  };
  
  addExceptionMechanism(event); // defaults to { type: 'generic', handled: true }
  event.level = 'error';
  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }
  return resolvedSyncPromise(event);
}

function extractTypeAndValue(ex: Error): { type: string, value: string } {
  const { stack } = ex;
  if (stack) {
    const stackAry: string[] = stack.split('\n')
    if (stackAry[0]) {
      const regExp = /\s*:\s*/g
      const errorAry = stackAry[0].split(regExp)
      return {
        type: errorAry[2],
        value: errorAry[3]
      }
    }
  } 
  return {
    type: 'Error',
    value: '未知的错误类型'
  }
}

export function parseStackFrames(
  stackParser: StackParser,
  ex: Error & { framesToPop?: number; stacktrace?: string },
): StackFrame[] {
  const stacktrace = ex.stacktrace || ex.stack || '';

  const popSize = getPopSize(ex);

  try {
    return stackParser(stacktrace, popSize);
  } catch (e) {
    // no-empty
  }

  return [];
}

function getPopSize(ex: Error & { framesToPop?: number }): number {
  if (ex) {
    if (typeof ex.framesToPop === 'number') {
      return ex.framesToPop;
    }
  }

  return 0;
}

