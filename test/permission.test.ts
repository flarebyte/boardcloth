import { BoardclothParams, MessageCreator } from '../src/messaging';
import {
  isGranted,
  createAgentPermission,
  AgentPermission,
} from '../src/permission';

const actionName = 'core:read.log';

const examples: [BoardclothParams, AgentPermission[], boolean][] = [
  [
    new MessageCreator()
      .addHeaderSingle('action', actionName)
      .addHeaderSingle('resource', 'history/recent')
      .addHeaderSingle('year', '2022').message.headers,
    [createAgentPermission(actionName, '*')],
    true,
  ],
  [
    new MessageCreator()
      .addHeaderSingle('action', actionName)
      .addHeaderSingle('resource', 'history/recent')
      .addHeaderSingle('year', '2022').message.headers,
    [createAgentPermission(actionName, 'history/')],
    true,
  ],
  [
    new MessageCreator()
      .addHeaderSingle('action', actionName)
      .addHeaderSingle('resource', 'history/ancient')
      .addHeaderSingle('year', '1900').message.headers,
    [createAgentPermission(actionName, 'history/recent')],
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
