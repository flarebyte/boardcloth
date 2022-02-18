export interface Validation {
  permissionName: string;
  validatorName: string;
}

type Message = string;
type ValidatorResult = 'ok' | string[];

export type MessageValidator = (message: Message) => ValidatorResult;

export interface Validator {
  name: string;
  messageValidator: MessageValidator;
}
