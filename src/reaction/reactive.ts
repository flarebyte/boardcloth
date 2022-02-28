import { BoardclothMessage } from '../message/messaging';

export interface MessageSender {
  send(message: BoardclothMessage): void;
}

export interface MessageReceiver {
  onReceive(message: BoardclothMessage): Promise<void>;
}
