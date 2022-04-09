import { BoardclothMessage } from './messaging';

type OutcomeErrorKind =
  | 'not-supported'
  | 'invalid-message'
  | 'access-denied'
  | 'applicative';

export interface EssentialHeaders {
  senderMessageId: string;
  agentName: string;
  action: string;
  resource: string;
}

export interface OutcomeError extends Partial<EssentialHeaders> {
  kind: OutcomeErrorKind;
  messages: string[];
}

export const createUnsupportedOutcomeError = (
  message: string,
): OutcomeError => ({
  kind: 'not-supported',
  messages: [message]
});

export const createOutcomeError = (
    kind: OutcomeErrorKind,
    message: string,
    essentialHeaders:EssentialHeaders
  ): OutcomeError => ({
    kind,
    messages: [message],
    ...essentialHeaders
  });

export interface MessageOutcome {
  message: BoardclothMessage;
  errors: OutcomeError[];
}

export const fromMessage = (message: BoardclothMessage): MessageOutcome => ({
  message,
  errors: [],
});

export function toEssentialHeaders(
  _message: BoardclothMessage
): EssentialHeaders | false {
  return false;
}

export const hasEssentialHeaders = (
  value: unknown
): value is EssentialHeaders =>
  value !== false && typeof (value as EssentialHeaders).action === 'string';
