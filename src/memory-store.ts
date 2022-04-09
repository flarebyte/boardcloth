import CircularBuffer from 'mnemonist/circular-buffer';
import { BoardclothMessage } from './messaging';

export interface MemoryStoreBase {
  push(message: BoardclothMessage): void;
  get(id: string): BoardclothMessage | false;
  toArray(): BoardclothMessage[];
}

export class CircularMemoryStore implements MemoryStoreBase {
  _store: CircularBuffer<BoardclothMessage>;
  constructor(size: number) {
    this._store = new CircularBuffer<BoardclothMessage>(Array, size);
  }
  push(message: BoardclothMessage): void {
    this._store.push(message);
  }
  get(id: string): false | BoardclothMessage {
    throw new Error('Method not implemented.');
  }
  toArray(): BoardclothMessage[] {
    return [...this._store.toArray()];
  }
}
