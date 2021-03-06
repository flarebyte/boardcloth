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

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isSafeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value);

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

const validateNumber = (
  schema: Pick<FullValueSchema, 'key' | 'minimum' | 'maximum'>,
  value: KeyValue
): string[] => {
  const numberValue = parseFloat(value.v);
  if (!isFiniteNumber(numberValue)) {
    return [`The key ${schema.key} should be a finite number`];
  }

  const valueInRange = lengthInRange(
    numberValue,
    schema.minimum,
    schema.maximum
  );
  if (!valueInRange) {
    return [
      `The  number value for the key ${schema.key}
      is out of range [${schema.minimum}, ${schema.maximum}]
      : ${numberValue}`,
    ];
  }
  return [];
};

const validateInteger = (
  schema: Pick<FullValueSchema, 'key' | 'minimum' | 'maximum'>,
  value: KeyValue
): string[] => {
  const numberValue = parseFloat(value.v);
  if (!isSafeInteger(numberValue)) {
    return [`The key ${schema.key} should be a safe integer`];
  }

  const valueInRange = lengthInRange(
    numberValue,
    schema.minimum,
    schema.maximum
  );
  if (!valueInRange) {
    return [
      `The  number value for the key ${schema.key}
      is out of range [${schema.minimum}, ${schema.maximum}]
      : ${numberValue}`,
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
    case 'number':
      return validateNumber(valueSchema.schema, value);
    case 'integer':
      return validateInteger(valueSchema.schema, value);
    default:
      return [`Kind ${valueSchema.kind} is not supported for single value`];
  }
};

const validateStringList = (
  schema: Pick<
    FullValueSchema,
    'key' | 'minimum' | 'maximum' | 'minItems' | 'maxItems' | 'itemsMultipleOf'
  >,
  value: KeyMultipleValues
): string[] => {
  const listInRange = lengthInRange(
    value.v.length,
    schema.minItems,
    schema.maxItems
  );
  if (!listInRange) {
    return [
      `The length of the list for the key ${schema.key}
      is out of range [${schema.minItems}, ${schema.maxItems}]
      : ${value.v.length}`,
    ];
  }

  const isListMultipleOf =
    schema.itemsMultipleOf === 1
      ? true
      : value.v.length % schema.itemsMultipleOf === 0;

  if (!isListMultipleOf) {
    return [
      `The length of the list for the key ${schema.key}
          is should be a multiple of ${schema.itemsMultipleOf}
          : ${value.v.length}`,
    ];
  }
  const isStringInRange = (text: string) =>
    lengthInRange(text.length, schema.minimum, schema.maximum);

  const allStringInRange = value.v.every(isStringInRange);

  if (!allStringInRange) {
    return [
      `All the strings for the key ${schema.key}
      should be in the range [${schema.minimum}, ${schema.maximum}]`,
    ];
  }
  return [];
};

const validateUniqueStringList = (
  schema: Pick<
    FullValueSchema,
    'key' | 'minimum' | 'maximum' | 'minItems' | 'maxItems'
  >,
  value: KeyMultipleValues
): string[] => {
  const listInRange = lengthInRange(
    value.v.length,
    schema.minItems,
    schema.maxItems
  );
  if (!listInRange) {
    return [
      `The length of the list for the key ${schema.key}
      is out of range [${schema.minItems}, ${schema.maxItems}]
      : ${value.v.length}`,
    ];
  }
  const isUnique = value.v.length === new Set(value.v).size;
  if (!isUnique) {
    return [`The elements in list for the key ${schema.key} should be unique`];
  }

  const isStringInRange = (text: string) =>
    lengthInRange(text.length, schema.minimum, schema.maximum);

  const allStringInRange = value.v.every(isStringInRange);

  if (!allStringInRange) {
    return [
      `All the strings for the key ${schema.key}
      should be in the range [${schema.minimum}, ${schema.maximum}]`,
    ];
  }
  return [];
};

const validateStringEnumList = (
  schema: Pick<FullValueSchema, 'key' | 'choices' | 'minItems' | 'maxItems'>,
  value: KeyMultipleValues
): string[] => {
  const listInRange = lengthInRange(
    value.v.length,
    schema.minItems,
    schema.maxItems
  );
  if (!listInRange) {
    return [
      `The length of the list for the key ${schema.key}
      is out of range [${schema.minItems}, ${schema.maxItems}]
      : ${value.v.length}`,
    ];
  }

  const isUnique = value.v.length === new Set(value.v).size;
  if (!isUnique) {
    return [`The elements in list for the key ${schema.key} should be unique`];
  }
  const isStringIncluded = (text: string) => schema.choices.includes(text);
  const allStringIncluded = value.v.every(isStringIncluded);

  if (!allStringIncluded) {
    return [
      `All the strings for the key ${schema.key}
      should be part of a known enumeration`,
    ];
  }
  return [];
};
const validateKeyMultipleValues = (
  valueSchema: ValueSchema,
  value: KeyMultipleValues
): string[] => {
  switch (valueSchema.kind) {
    case 'string-list':
      return validateStringList(valueSchema.schema, value);
    case 'unique-string-list':
      return validateUniqueStringList(valueSchema.schema, value);
    case 'string-enum-list':
      return validateStringEnumList(valueSchema.schema, value);
    default:
      return [`Kind ${valueSchema.kind} is not supported for multiple values`];
  }
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
