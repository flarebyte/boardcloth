import { BoardclothMessage, MessageCreator } from '../message/messaging';
import { EssentialHeaders } from './board-sender';

export const createMessageForInvalidSize = (size: number): BoardclothMessage => {
    const creator = new MessageCreator();
    creator.addHeaderSingle('action', 'core:log:append');
    creator.addHeaderSingle('resource', 'log/invalid/size');
    creator.addParamSingle('message-size', `${size}`);
    return creator.message;
  };

  export const createMessageForNoEssentialHeaders = (
    size: number
  ): BoardclothMessage => {
    const creator = new MessageCreator();
    creator.addHeaderSingle('action', 'core:log:append');
    creator.addHeaderSingle('resource', 'log/invalid/no-essential-headers');
    creator.addParamSingle('message-size', `${size}`);
    return creator.message;
  };
  export const createInvalidMessage = (
    essentialHeaders: EssentialHeaders,
    size: number,
    errorMessages: string[]
  ): BoardclothMessage => {
    const creator = new MessageCreator();
    creator.addHeaderSingle('action', 'core:log:append');
    creator.addHeaderSingle('resource', 'log/invalid/invalid-message');
    creator.addParamSingle('message-size', `${size}`);
    creator.addParamSingle(
      'sender-message-id',
      `${essentialHeaders.senderMessageId}`
    );
    creator.addParamSingle('action', `${essentialHeaders.action}`);
    creator.addParamSingle('resource', `${essentialHeaders.resource}`);
    creator.addParamMultiple('messages', errorMessages);
    return creator.message;
  };
  export const createAccessMessage = (
    essentialHeaders: EssentialHeaders,
    size: number,
    granted: boolean
  ): BoardclothMessage => {
    const creator = new MessageCreator();
    creator.addHeaderSingle('action', 'core:log:append');
    creator.addHeaderSingle('resource', 'log/access');
    creator.addParamSingle('action', `${essentialHeaders.action}`);
    creator.addParamSingle('resource', `${essentialHeaders.resource}`);
    creator.addParamSingle('granted', `${granted ? 'yes' : 'no'}`);
    creator.addParamSingle('message-size', `${size}`);
    creator.addParamSingle(
      'sender-message-id',
      `${essentialHeaders.senderMessageId}`
    );
    return creator.message;
  };
  