import {
  createOutcomeError,
  createUnsupportedOutcomeError,
  hasEssentialHeaders,
  MessageOutcome,
  toEssentialHeaders,
} from '../message/outcome';
import { PermissionBaseManager } from '../permission/granting';

export const checkSupported = (outcome: MessageOutcome): MessageOutcome => {
  const isSupported = hasEssentialHeaders(toEssentialHeaders(outcome.message));
  return isSupported
    ? outcome
    : {
        ...outcome,
        errors: [
          createUnsupportedOutcomeError(
            'Message without the essential headers'
          ),
        ],
      };
};

export const checkAuthorized =
  (manager: PermissionBaseManager) =>
  (outcome: MessageOutcome): MessageOutcome => {
    if (outcome.errors.length > 0) {
      return outcome;
    }
    const essentialHeaders = toEssentialHeaders(outcome.message);
    const isSupported = hasEssentialHeaders(essentialHeaders);

    const isGranted = isSupported && manager.isGranted2(essentialHeaders);
    if (isGranted || !isSupported) {
      return outcome;
    } else {
      return {
        ...outcome,
        errors: [
          createOutcomeError(
            'access-denied',
            'Message is not authorized for this agent',
            essentialHeaders
          ),
        ],
      };
    }
  };
