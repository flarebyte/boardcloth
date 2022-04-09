import { of } from 'rxjs';
import { BoardclothMessage } from '../message/messaging';
import { fromMessage } from '../message/outcome';

export const ofMessage = (message: BoardclothMessage) => {
  const outcome = fromMessage(message);
  return of(outcome);
};
