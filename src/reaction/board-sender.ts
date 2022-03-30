import { BoardclothMessage } from '../message/messaging';
import { PermissionBaseManager } from '../permission/granting';
import { MessageSchema, validateMessage } from '../validation/validating';
import {
  createMessageForInvalidSize,
  createAccessMessage,
  createInvalidMessage,
  createMessageForNoEssentialHeaders,
} from './common-message';

interface QueueOpts {
  name: string;
}

interface MessageQueue {
  send(message: BoardclothMessage): void;
}

interface QueueFactory {
  create(opts: QueueOpts): MessageQueue;
}

export interface EssentialHeaders {
  senderMessageId: string;
  action: string;
  resource: string;
}
interface BoardMessageSenderOpts {
  maxMessageSizeInBytes: number;
}

export class BoardMessageSender {
  permissionManager: PermissionBaseManager;
  rebelQueue: MessageQueue;
  invalidQueue: MessageQueue;
  accessQueue: MessageQueue;
  mainQueue: MessageQueue;
  opts: BoardMessageSenderOpts;

  constructor(
    queueFactory: QueueFactory,
    permissionManager: PermissionBaseManager,
    opts: BoardMessageSenderOpts
  ) {
    this.permissionManager = permissionManager;
    this.rebelQueue = queueFactory.create({ name: 'rebel' });
    this.invalidQueue = queueFactory.create({ name: 'invalid' });
    this.accessQueue = queueFactory.create({ name: 'access' });
    this.mainQueue = queueFactory.create({ name: 'main' });
    this.opts = opts;
  }
  #sendIfEssential(
    essentialHeaders: EssentialHeaders,
    sizeInBytes: number,
    message: BoardclothMessage
  ) {
    const isGranted = this.permissionManager.isGranted(
      'agentNamePlease',
      message.headers
    );
    this.accessQueue.send(
      createAccessMessage(essentialHeaders, sizeInBytes, isGranted)
    );
    if (!isGranted) {
      return;
    }
    const loadedSchema = loadSchema(essentialHeaders.action);
    const validatorResult = validateMessage(loadedSchema, message);
    if (validatorResult !== 'ok') {
      this.invalidQueue.send(
        createInvalidMessage(essentialHeaders, sizeInBytes, validatorResult)
      );
    }
    this.mainQueue.send(message);
  }
  send(message: BoardclothMessage) {
    const sizeInBytes = checkSize(message);
    if (sizeInBytes > this.opts.maxMessageSizeInBytes) {
      // Very large messages would lead to terrible performances
      this.rebelQueue.send(createMessageForInvalidSize(sizeInBytes));
      return;
    }
    const essentialHeaders = extractEssentialHeader(message);
    if (essentialHeaders) {
      this.#sendIfEssential(essentialHeaders, sizeInBytes, message);
    } else {
      this.rebelQueue.send(createMessageForNoEssentialHeaders(sizeInBytes));
    }
  }
}

function checkSize(message: BoardclothMessage): number {
  return 42;
}
function extractEssentialHeader(
  message: BoardclothMessage
): EssentialHeaders | false {
  return false;
}

const isEssentialHeader = (value: unknown): value is EssentialHeaders =>
  typeof (value as EssentialHeaders).action === 'string';

const loadSchema = (action: string): MessageSchema => {
  throw new Error('Not implemented yet');
};
