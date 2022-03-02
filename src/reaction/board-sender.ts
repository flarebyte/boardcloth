import { BoardclothMessage, MessageCreator } from '../message/messaging';
import {
  PermissionBaseManager,
} from '../permission/granting';
import { MessageSchema, validateMessage } from '../validation/validating';

interface QueueOpts {
  name: string;
}

interface MessageQueue {
  send(message: BoardclothMessage): void;
}

class MemoryQueue implements MessageQueue {
  opts: QueueOpts;
  constructor(opts: QueueOpts) {
    this.opts = opts;
  }
  send(_message: BoardclothMessage): void {
    throw new Error('Method not implemented.');
  }
}

const createMessageForInvalidSize = (size: number): BoardclothMessage => {
  const creator = new MessageCreator();
  creator.addHeaderSingle('action', 'core:log:append');
  creator.addHeaderSingle('resource', 'log/invalid/size');
  creator.addParamSingle('message-size', `${size}`);
  return creator.message;
};

const createMessageForNoEssentialHeaders = (
  size: number
): BoardclothMessage => {
  const creator = new MessageCreator();
  creator.addHeaderSingle('action', 'core:log:append');
  creator.addHeaderSingle('resource', 'log/invalid/no-essential-headers');
  creator.addParamSingle('message-size', `${size}`);
  return creator.message;
};

const createInvalidMessage = (
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

const createAccessMessage = (
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

interface QueueFactory {
  create(opts: QueueOpts): MessageQueue;
}
class MemoryQueueFactory implements QueueFactory {
  create(opts: QueueOpts): MessageQueue {
    return new MemoryQueue(opts);
  }
}

interface EssentialHeaders {
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
    this.opts = opts;
  }

  send(message: BoardclothMessage) {
    const sizeInBytes = checkSize(message);
    if (sizeInBytes > this.opts.maxMessageSizeInBytes) {
      // Very large messages will lead to terrible performances
      // so we should block them and assume we have a bug
      this.rebelQueue.send(createMessageForInvalidSize(sizeInBytes));
      return;
    }
    const essentialHeaders = extractEssentialHeader(message);
    if (essentialHeaders === false) {
      // All messages should have a these essential fields
      this.rebelQueue.send(createMessageForNoEssentialHeaders(sizeInBytes));
    }
    if (isEssentialHeader(essentialHeaders)) {
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
