import { KeyTemplateManager } from '../../src/message/key-template';

const examples: [string][] = [
  ['urn:core:contributor:oli/nickname'],
  ['urn:core:contributor:{name}/nickname'],
  ['urn:core:contributor:oli/homepage/url'],
  ['urn:core:contributor:{name}/homepage/url'],
  ['core:contributor:{name}/homepage/url/{media-type}'],
];

describe('key-template', () => {
  const keyTemplateManager = new KeyTemplateManager();
  it('should build a key template', () => {
    const actual = keyTemplateManager.build({
      prefix: 'contributor',
      segments: [
        { kind: 'var', value: 'name' },
        { kind: 'const', value: 'nickname' },
      ],
    });
    expect(actual).toStrictEqual('contributor:{name}/nickname');
  });
  it.each(examples)('should parse and build key template %s', (key) => {
    const parsed = keyTemplateManager.parse(key);
    const actual = parsed
      ? keyTemplateManager.build(parsed)
      : 'parse has failed';
    expect(actual).toStrictEqual(key);
  });
});
