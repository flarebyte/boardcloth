import {
  BoardclothMessage,
  BoardclothParams,
  KeyMultipleValues,
  KeyValue,
} from '../message/messaging';

type ValidatorResult = 'ok' | string[];

export interface FullValueSchema {
  key: string;
  minItems: number;
  maxItems: number;
  itemsMultipleOf: number;
  choices: string[];
  minimum: number;
  maximum: number;
}

export type ValueSchema =
  | {
      kind: 'string';
      schema: Pick<FullValueSchema, 'key' | 'minimum' | 'maximum'>;
    }
  | {
      kind: 'string-enum';
      schema: Pick<FullValueSchema, 'key' | 'choices'>;
    }
  | {
      kind: 'string-list';
      schema: Pick<
        FullValueSchema,
        | 'key'
        | 'minimum'
        | 'maximum'
        | 'minItems'
        | 'maxItems'
        | 'itemsMultipleOf'
      >;
    }
  | {
      kind: 'unique-string-list';
      schema: Pick<
        FullValueSchema,
        'key' | 'minimum' | 'maximum' | 'minItems' | 'maxItems'
      >;
    }
  | {
      kind: 'string-enum-list';
      schema: Pick<
        FullValueSchema,
        'key' | 'choices' | 'minItems' | 'maxItems'
      >;
    }
  | {
      kind: 'number';
      schema: Pick<FullValueSchema, 'key' | 'minimum' | 'maximum'>;
    }
  | {
      kind: 'integer';
      schema: Pick<FullValueSchema, 'key' | 'minimum' | 'maximum'>;
    };

export interface ParamsSchema {
  single: ValueSchema[];
  multiple: ValueSchema[];
}

export interface MessageSchema {
  headers: ParamsSchema;
  params: ParamsSchema;
}

const validateKeyValue = (
  validator: ValueSchema,
  value: KeyValue
): string[] => {
  return [];
};
const validateKeyMultipleValues = (
  validator: ValueSchema,
  value: KeyMultipleValues
): string[] => {
  return [];
};

const validateSingleParams = (
  section: 'headers' | 'params',
  validator: ParamsSchema,
  params: BoardclothParams
): string[] => {
  const actualKeys = new Set(params.single.map((s) => s.k));
  const validKeys = new Set(validator.single.map((s) => s.key));
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
  validator: ParamsSchema,
  params: BoardclothParams
): string[] => {
  const single = validateSingleParams(section, validator, params);
  return [...single];
};

export const validateMessage = (
  validator: MessageSchema,
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
