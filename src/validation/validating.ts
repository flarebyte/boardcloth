import {
  BoardclothMessage,
  BoardclothParams,
  KeyMultipleValues,
  KeyValue,
} from '../message/messaging';

type ValidatorResult = 'ok' | string[];

export interface ValueValidator {
  k: string;
  v: string[];
}

export interface ParamsValidator {
  single: ValueValidator[];
  multiple: ValueValidator[];
}

export interface MessageValidator {
  headers: ParamsValidator;
  params: ParamsValidator;
}

const validateKeyValue = (
  validator: ValueValidator,
  value: KeyValue
): string[] => {
  return [];
};
const validateKeyMultipleValues = (
  validator: ValueValidator,
  value: KeyMultipleValues
): string[] => {
  return [];
};

const validateSingleParams = (
  section: 'headers' | 'params',
  validator: ParamsValidator,
  params: BoardclothParams
): string[] => {
  const actualKeys = new Set(params.single.map((s) => s.k));
  const validKeys = new Set(validator.single.map((s) => s.k));
  const hasKnownKey = [...actualKeys].every((k) => validKeys.has(k));
  if (!hasKnownKey) {
    return [`The message ${section}/single has unknown keys`];
  }
  // From here, the key names are sanitized
  if (actualKeys.size < params.single.length) {
    return [`The message ${section}/single has duplicates`];
  }
  

  return [];
};

const validateParams = (
  section: 'headers' | 'params',
  validator: ParamsValidator,
  params: BoardclothParams
): string[] => {
  const single = validateSingleParams(section, validator, params);
  return [...single];
};

export const validateMessage = (
  validator: MessageValidator,
  message: BoardclothMessage
): ValidatorResult => {
  const headersWarnings = validateParams(
    'headers',
    validator.headers,
    message.headers
  );
  const paramsWarnings = validateParams(
    'params',
    validator.params,
    message.params
  );
  const warnings = [...headersWarnings, ...paramsWarnings];
  return warnings.length === 0 ? 'ok' : warnings;
};
