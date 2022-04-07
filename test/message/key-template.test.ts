import {
  KeyTemplateManager,
  KeyTemplateStore,
} from '../../src/message/key-template';

class PredictableTemplateKeyVarGenerator {
  counter: number = 0;
  generate(domain: string): string {
    return `${this.counter++}-${domain}`;
  }
}

class PredictableTemplateKeyVarValidator {
  isValid(domain: string, id: string): boolean {
    return id.endsWith(domain);
  }
}

const gen = new PredictableTemplateKeyVarGenerator();

const templates: [string, string[]][] = [
  [
    'author',
    [
      'author:{author}/name',
      'author:{author}/city',
      'author:{author}/homepage',
    ],
  ],
  [
    'project',
    [
      'core:project:{project}/name',
      'core:project:{project}/description',
      'core:project:{project}/author/{author}/name',
    ],
  ],
];

const keyIds: [string, string][] = [
  ['author', `author:${gen.generate('author')}/name`],
  ['author', `author:${gen.generate('author')}/city`],
  ['author', `author:${gen.generate('author')}/homepage`],

  ['project', `core:project:${gen.generate('project')}/name`],
  ['project', `core:project:${gen.generate('project')}/description`],
  [
    'project',
    `core:project:${gen.generate('project')}/author/${gen.generate(
      'author'
    )}/name`,
  ],
];

const badKeyIds: [string, string][] = [
  ['author', `bad-author:${gen.generate('author')}/name`],
  ['author', `author:${gen.generate('author')}/bad-city`],
  ['author', `author:${gen.generate('author')}-bad/homepage`],

  ['project', `bad:core:project:${gen.generate('project')}/name`],
  ['project', `core:project:${gen.generate('project')}-bad/description`],
  [
    'project',
    `core:project:${gen.generate('project')}/author/${gen.generate(
      'author'
    )}-bad/name`,
  ],
  ['project', 'core:project'],
  ['project', 'core:project:'],
  ['project', ''],
];

describe('key-template', () => {
  const validator = new PredictableTemplateKeyVarValidator();
  const store = new KeyTemplateStore(templates);
  const keyTemplateManager = new KeyTemplateManager(store, validator);
  it.each(templates.flatMap((t) => t[1]))(
    'should parse and build key template %s',
    (key) => {
      const parsed = keyTemplateManager.parseTemplate(key);
      const actual = parsed
        ? keyTemplateManager.buildTemplate(parsed)
        : 'parse has failed';
      expect(actual).toStrictEqual(key);
    }
  );
  it.each(keyIds)(
    'should parse and build for category %s and key %j',
    (category, key) => {
      const parsed = keyTemplateManager.parseKey(category, key);
      const actual = parsed
        ? keyTemplateManager.buildKey(parsed)
        : 'parse has failed';
      expect(actual).toStrictEqual(key);
    }
  );
  it.each(badKeyIds)(
    'should detect bad keys for category %s and key %j',
    (category, key) => {
      const parsed = keyTemplateManager.parseKey(category, key);
      expect(parsed).toBeFalsy();
    }
  );
});
