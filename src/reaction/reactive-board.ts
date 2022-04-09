import { map } from 'rxjs';
import { BoardclothMessage } from '../message/messaging';
import { PermissionBaseManager } from '../permission/granting';
import { checkAuthorized, checkSupported } from './outcome-checker';
import { ofMessage } from './reactive-toolkit';

interface Managers {
  permission: PermissionBaseManager;
}

export const ofCheckedMessage =
  (managers: Managers) => (message: BoardclothMessage) => {
    return ofMessage(message).pipe(
      map(checkSupported),
      map(checkAuthorized(managers.permission))
    );
  };
