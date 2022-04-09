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

export const createUnsupportedOutcomeError = (): OutcomeError => ({
  kind: 'not-supported',
  messages: ['Message without the essential headers'],
});
export const createAccessDeniedOutcomeError = (
  essentialHeaders: EssentialHeaders
): OutcomeError => ({
  kind: 'access-denied',
  messages: ['Message is not authorized for this agent'],
  ...essentialHeaders,
});

export const createOutcomeError = (
  kind: OutcomeErrorKind,
  message: string,
  essentialHeaders: EssentialHeaders
): OutcomeError => ({
  kind,
  messages: [message],
  ...essentialHeaders,
});

export interface MessageOutcome {
  message: BoardclothMessage;
  essentialHeaders?: EssentialHeaders;
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
