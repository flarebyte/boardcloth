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
  searchable: boolean;
}

export type ValueSchema =
  | {
      kind: 'string';
      schema: Pick<
        FullValueSchema,
        'key' | 'minimum' | 'maximum' | 'searchable'
      >;
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

const lengthInRange = (
  length: number,
  minimum: number,
  maximum: number
): boolean => length >= minimum && length <= maximum;

const validateString = (
  schema: Pick<FullValueSchema, 'key' | 'minimum' | 'maximum' | 'searchable'>,
  value: KeyValue
): string[] => {
  const stringInRange = lengthInRange(
    value.v.length,
    schema.minimum,
    schema.maximum
  );
  if (!stringInRange) {
    return [
      `The length of the string for the key ${schema.key}
      is out of range [${schema.minimum}, ${schema.maximum}]
      : ${value.v.length}`,
    ];
  }
  return [];
};

const validateStringEnum = (
  schema: Pick<FullValueSchema, 'key' | 'choices'>,
  value: KeyValue
): string[] => {
  const isStringIncluded = schema.choices.includes(value.v);
  if (!isStringIncluded) {
    return [
      `The string for the key ${schema.key}
      is not in the list of choices`,
    ];
  }
  return [];
};

const validateKeyValue = (
  valueSchema: ValueSchema,
  value: KeyValue
): string[] => {
  switch (valueSchema.kind) {
    case 'string':
      return validateString(valueSchema.schema, value);
    case 'string-enum':
      return validateStringEnum(valueSchema.schema, value);
    default:
      return ['should not exist'];
  }
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
  const validKeys = new Set(validator.single.map((s) => s.schema.key));
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
