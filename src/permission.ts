import { BoardclothParams } from './messaging';

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
export const isGranted = (
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
