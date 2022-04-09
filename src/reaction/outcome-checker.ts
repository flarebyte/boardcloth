import {
  createAccessDeniedOutcomeError,
  createUnsupportedOutcomeError,
  hasEssentialHeaders,
  MessageOutcome,
  toEssentialHeaders,
} from '../message/outcome';
import { PermissionBaseManager } from '../permission/granting';

export const checkSupported = (outcome: MessageOutcome): MessageOutcome => {
  const essentialHeaders = toEssentialHeaders(outcome.message);
  const isSupported = hasEssentialHeaders(essentialHeaders);
  return isSupported
    ? { ...outcome, essentialHeaders }
    : {
        ...outcome,
        errors: [createUnsupportedOutcomeError()],
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
        errors: [createAccessDeniedOutcomeError(essentialHeaders)],
      };
    }
  };
