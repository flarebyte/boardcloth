import { map, of } from 'rxjs';
import { BoardclothMessage } from '../message/messaging';
import { fromMessage } from '../message/outcome';
import { PermissionBaseManager } from '../permission/granting';
import { ValidationBaseManager } from '../validation/validating';
import {
  checkAuthorized,
  checkSupported,
  checkValidOutcome,
} from './outcome-checker';

interface MessageFactoryOpts {
  permissionManager: PermissionBaseManager;
  validationManager: ValidationBaseManager;
}

const ofMessageAsOutcome = (message: BoardclothMessage) => {
  const outcome = fromMessage(message);
  return of(outcome);
};

export const ofCheckedMessage =
  (opts: MessageFactoryOpts) => (message: BoardclothMessage) => {
    return ofMessageAsOutcome(message).pipe(
      map(checkSupported),
      map(checkAuthorized(opts.permissionManager)),
      map(checkValidOutcome(opts.validationManager))
    );
  };
