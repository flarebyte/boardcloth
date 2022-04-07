import { BoardclothParams } from '../message/messaging';

export interface SupportedAction {
  name: string;
  description: string;
  homepage: string;
  flags: string[];
}

export interface AgentPermission {
  action: string;
  resource: string;
}

export const createAgentPermission = (
  action: string,
  resource: string
): AgentPermission => ({
  action,
  resource,
});

export interface AccessToken {
  name: string;
  secret: string;
}

interface HeadersPermission {
  action: string;
  resource: string;
}

const matchPermissionRule = (rule: string, value: string): boolean => {
  if (rule.length === 0 || value.length === 0) {
    return false;
  }
  return rule === '*' ? true : value.startsWith(rule);
};

const isPermissionGranted =
  (headers: HeadersPermission) =>
  (permission: AgentPermission): boolean =>
    matchPermissionRule(permission.action, headers.action) &&
    matchPermissionRule(permission.resource, headers.resource);

const toHeadersPermission = (
  headers: BoardclothParams
): HeadersPermission | false => {
  const action = headers.single.find((keyValue) => keyValue.k === 'action');
  const resource = headers.single.find((keyValue) => keyValue.k === 'resource');
  if (!action || !resource) {
    return false;
  }
  return { action: action.v, resource: resource.v };
};
const isGranted = (
  permissions: AgentPermission[],
  headers: BoardclothParams
) => {
  const headersPermission = toHeadersPermission(headers);
  if (headersPermission === false) {
    return false;
  }
  const grantor = isPermissionGranted(headersPermission);
  return permissions.some(grantor);
};

export interface PermissionStoreBaseStore {
  getPermissions(agentName: string): AgentPermission[];
}
export class PermissionStore implements PermissionStoreBaseStore {
  store: { [agentName: string]: AgentPermission[] } = {};
  constructor(permissions: [string, AgentPermission[]][]) {
    for (const [agentName, agentPermissions] of permissions) {
      this.store[agentName] = agentPermissions;
    }
  }
  getPermissions(agentName: string): AgentPermission[] {
    return this.store[agentName] || [];
  }
}

export interface PermissionBaseManager {
  isGranted(agentName: string, headers: BoardclothParams): boolean;
}

export class PermissionManager implements PermissionBaseManager {
  store: PermissionStoreBaseStore;
  constructor(store: PermissionStoreBaseStore) {
    this.store = store;
  }

  isGranted(agentName: string, headers: BoardclothParams): boolean {
    const permissions = this.store.getPermissions(agentName);
    if (permissions.length === 0) return false;
    return isGranted(permissions, headers);
  }
}
