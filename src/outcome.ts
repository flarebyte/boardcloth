import { BoardclothMessage } from './messaging';

export type OutcomeErrorKind =
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
