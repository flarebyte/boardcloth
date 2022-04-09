import { map, of } from 'rxjs';
import { BoardclothMessage } from '../message/messaging';
import { fromMessage } from '../message/outcome';
import { PermissionBaseManager } from '../permission/granting';
import { checkAuthorized, checkSupported } from './outcome-checker';

interface MessageFactoryOpts {
  permission: PermissionBaseManager;
}

const ofMessageAsOutcome = (message: BoardclothMessage) => {
    const outcome = fromMessage(message);
    return of(outcome);
  };
  
export const ofCheckedMessage =
  (opts: MessageFactoryOpts) => (message: BoardclothMessage) => {
    return ofMessageAsOutcome(message).pipe(
      map(checkSupported),
      map(checkAuthorized(opts.permission))
    );
  };
