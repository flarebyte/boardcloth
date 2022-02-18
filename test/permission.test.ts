import { BoardclothParams, MessageCreator } from '../src/messaging';
import {
  isGranted,
  createAgentPermission,
  AgentPermission,
} from '../src/permission';

const examples: [BoardclothParams, AgentPermission[], boolean][] = [
  [
    new MessageCreator()
      .addHeaderSingle('action', 'core:read.log')
      .addHeaderSingle('resource', 'history/recent')
      .addHeaderSingle('year', '2022').message.headers,
    [createAgentPermission('read.log', '*')],
    true,
  ],
  [
    new MessageCreator()
      .addHeaderSingle('action', 'core:read.log')
      .addHeaderSingle('resource', 'history/recent')
      .addHeaderSingle('year', '2022').message.headers,
    [createAgentPermission('read.log', 'history/')],
    true,
  ],
  [
    new MessageCreator()
      .addHeaderSingle('action', 'core:read.log')
      .addHeaderSingle('resource', 'history/ancient')
      .addHeaderSingle('year', '1900').message.headers,
    [createAgentPermission('read.log', 'history/recent')],
    false,
  ],
];

describe('permission', () => {
  it.each(examples)(
    'should check permission %j',
    (request, permissions, expected) => {
      const actual = isGranted(permissions, request);
      expect(actual).toStrictEqual(expected);
    }
  );
});
