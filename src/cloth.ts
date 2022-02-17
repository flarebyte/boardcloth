const boardclothAccessList = ['red', 'orange', 'yellow'] as const;

/**
 * Type for Access role for Boardcloth
 */
export type BoardclothAccess = typeof boardclothAccessList[number];
/**
 *  Guard for Access role for Boardcloth
 */
export const isBoardclothAccess = (value: unknown): value is BoardclothAccess =>
  boardclothAccessList.includes(value as BoardclothAccess);

interface AccessStatement {
  action: BoardclothAccess;
  resource: string;
}

interface AccessToken {
  value: string;
}

class BoardclothPluginMeta {
  _name = '';
  _description = '';
  _version = '0.0.0';
  _homepage = '';
  _flags: string[] = [];
  _access: AccessStatement[] = [];
  _token: AccessToken = { value: ''};

  get name() {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }
  get description() {
    return this._description;
  }
  set description(description: string) {
    this._description = description;
  }
  get version() {
    return this._version;
  }
  set version(version: string) {
    this._version = version;
  }
  get homepage() {
    return this._homepage;
  }
  set homepage(homepage: string) {
    this._homepage = homepage;
  }
  get flags() {
    return this._flags;
  }
  set flags(flags: string[]) {
    this._flags = flags;
  }
  get access() {
    return this._access;
  }
  set access(access: AccessStatement[]) {
    this._access = access;
  }
  get token() {
    return this._token;
  }
  set token(token: AccessToken) {
    this._token = token;
  }
}

class Boardcloth {
  flags: string[];
  constructor(flags: string[]) {
    this.flags = flags;
  }
}
