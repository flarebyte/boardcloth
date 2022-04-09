import {
  createAccessDeniedOutcomeError,
  createUnsupportedOutcomeError,
  createValidationOutcomeError,
  EssentialHeaders,
  MessageOutcome,
  toEssentialHeaders,
} from '../message/outcome';
import { PermissionBaseManager } from '../permission/granting';
import { ValidationBaseManager } from '../validation/validating';

const hasEssentialHeaders = (value: unknown): value is EssentialHeaders =>
  value !== false && typeof (value as EssentialHeaders).action === 'string';

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
    if (
      outcome.errors.length > 0 ||
      !hasEssentialHeaders(outcome.essentialHeaders)
    ) {
      return outcome;
    }

    const isGranted = manager.isGranted2(outcome.essentialHeaders);
    if (isGranted) {
      return outcome;
    } else {
      return {
        ...outcome,
        errors: [createAccessDeniedOutcomeError(outcome.essentialHeaders)],
      };
    }
  };

export const checkValidOutcome =
  (manager: ValidationBaseManager) =>
  (outcome: MessageOutcome): MessageOutcome => {
    if (
      outcome.errors.length > 0 ||
      !hasEssentialHeaders(outcome.essentialHeaders)
    ) {
      return outcome;
    }

    const validatorResult = manager.validate(
      outcome.essentialHeaders,
      outcome.message
    );
    if (validatorResult === 'ok') {
      return outcome;
    } else {
      return {
        ...outcome,
        errors: [
          createValidationOutcomeError(
            outcome.essentialHeaders,
            validatorResult
          ),
        ],
      };
    }
  };
