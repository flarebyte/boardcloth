import { AccessToken, AgentPermission } from './permission';

interface Author {
  name: string;
  url: string;
}

/**
 * Configuration for an Agent
 */
interface Agent {
  name: string;
  title: string;
  description: string;
  author: Author;
  homepage: string;
  version: string;
  flags: string[];
  permissions: AgentPermission[];
}

interface AgentHandle {
  name: string;
  token: AccessToken;
}

class Boardcloth {
  flags: string[];
  constructor(flags: string[]) {
    this.flags = flags;
  }
}
