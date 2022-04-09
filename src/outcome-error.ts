import { OutcomeError, EssentialHeaders, OutcomeErrorKind } from './outcome';


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

export const createValidationOutcomeError = (
  essentialHeaders: EssentialHeaders,
  messages: string[]
): OutcomeError => ({
  kind: 'invalid-message',
  messages,
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
