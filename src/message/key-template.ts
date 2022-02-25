interface KeySegment {
  value: string;
  kind: 'const' | 'var';
}

interface MessageKeyTemplate {
  key: string;
  prefix: string;
  segments: KeySegment[];
}

interface MessageKey {
  key: string;
  template: MessageKeyTemplate;
  segments: KeySegment[];
}

const escapeSegment = (segment: string): string =>
  segment.replace(/[{}\/]/g, '');

const toKeySegment = (text: string): KeySegment => {
  if (text.startsWith('{') && text.endsWith('}')) {
    return { value: text.slice(1, text.length - 1), kind: 'var' };
  }
  return { value: text, kind: 'const' };
};

export interface KeyTemplateBaseStore {
  getTemplates(category: string): MessageKeyTemplate[];
}

export interface KeyTemplateBaseManager {
  parseTemplate(key: string): MessageKeyTemplate | false;
  matchTemplate(category: string, key: string): MessageKeyTemplate | false;
  parseKey(category: string, key: string): MessageKey | false;
  buildTemplate(template: MessageKeyTemplate): string;
  buildKey(template: MessageKey): string;
}

const isKeySafe = (key: string): boolean => /[A-Za-z0-9}{\/_-]{5,}/.test(key);

const parseKeyTemplate = (key: string): false | MessageKeyTemplate => {
  {
    if (!isKeySafe(key)) {
      return false;
    }
    const insideSlash = key.split('/');
    const [lead, ...pathParts] = insideSlash;
    if (!lead) {
      return false;
    }

    const lastColon = lead.lastIndexOf(':');
    if (lastColon === -1) {
      return false;
    }
    const prefix = lead.slice(0, lastColon);
    const firstSegment = lead.slice(lastColon + 1, lead.length);

    if (prefix.length === 0 || firstSegment.length === 0) {
      return false;
    }

    const segments = [firstSegment, ...pathParts].map(toKeySegment);
    const template: MessageKeyTemplate = {
      key,
      prefix,
      segments,
    };
    return template;
  }
};

const isMessageKeyTemplate = (value: unknown): value is MessageKeyTemplate =>
  typeof value === 'object' && (value as MessageKeyTemplate).key !== undefined;

/**
 * Store
 */
export class KeyTemplateStore implements KeyTemplateBaseStore {
  store: { [category: string]: MessageKeyTemplate[] } = {};
  constructor(categoryTemplates: [string, string[]][]) {
    for (const [category, stringKeys] of categoryTemplates) {
      const keyTemplates = stringKeys
        .map(parseKeyTemplate)
        .filter(isMessageKeyTemplate);
      if (keyTemplates.length !== stringKeys.length) {
        throw new Error(
          `Some templates have an unsupported format for ${category}`
        );
      }
      this.store[category] = keyTemplates;
    }
  }
  getTemplates(category: string): MessageKeyTemplate[] {
    return this.store[category] || [];
  }
}

export interface TemplateKeyVarBaseGenerator {
  generate(domain: string): string;
}

const letters = 'BCDFGHJKLMNPRSTUVXZbcdfghjklmnprstuvxz'.split('');
const keyVarFormat = '123456789012'.split('');
const randChar = () =>
  letters[Math.floor(Math.random() * letters.length)] || 'A';
const domainIdLength = keyVarFormat.length + 3;

const getDomainAbbreviation = (domain: string): string =>
  `${domain.charAt(0)}${domain.charAt(domain.length - 1)}`;

/**
 * A very basic and naive TemplateKeyVarGenerator
 */
export class TemplateKeyVarGenerator implements TemplateKeyVarBaseGenerator {
  generate(domain: string): string {
    const domainId = keyVarFormat.map(randChar);
    const fullId = [...domainId, '-', getDomainAbbreviation(domain)];
    return fullId.join('');
  }
}

export interface TemplateKeyVarBaseValidator {
  isValid(domain: string, id: string): boolean;
}

/**
 * Validate id produced by TemplateKeyVarGenerator
 */
export class TemplateKeyVarValidator implements TemplateKeyVarBaseValidator {
  isValid(domain: string, id: string): boolean {
    if (id.length !== domainIdLength) {
      return false;
    }
    const [domainId, abbreviation] = id.split('-');
    if (!domainId || !abbreviation) {
      return false;
    }
    const expectedAbbreviation = getDomainAbbreviation(domain);
    if (abbreviation !== expectedAbbreviation) {
      return false;
    }
    return true;
  }
}

const fuzzyMatchTemplate = (
  keyVarValidator: TemplateKeyVarBaseValidator,
  template: MessageKeyTemplate,
  key: MessageKeyTemplate
): boolean => {
  if (template.prefix !== key.prefix) {
    return false;
  }
  for (const [idx, segment] of template.segments.entries()) {
    const actualSegment = key.segments[idx];
    if (!actualSegment) {
      return false;
    }
    if (segment.kind === 'const' && segment.value !== actualSegment.value) {
      return false;
    }
    if (
      segment.kind === 'var' &&
      !keyVarValidator.isValid(segment.value, actualSegment.value)
    ) {
      return false;
    }
  }
  return true;
};

export class KeyTemplateManager implements KeyTemplateBaseManager {
  store: KeyTemplateBaseStore;
  keyVarValidator: TemplateKeyVarBaseValidator;
  constructor(
    store: KeyTemplateBaseStore,
    keyVarValidator: TemplateKeyVarBaseValidator
  ) {
    this.store = store;
    this.keyVarValidator = keyVarValidator;
  }

  buildKey(messageKey: MessageKey): string {
    const segments = messageKey.segments
      .map((segment) =>
        segment.kind === 'var'
          ? `{${escapeSegment(segment.value)}}`
          : escapeSegment(segment.value)
      )
      .join('/');
    return `${messageKey.template.prefix}:${segments}`;
  }
  parseTemplate(key: string): false | MessageKeyTemplate {
    return parseKeyTemplate(key);
  }
  buildTemplate(template: MessageKeyTemplate): string {
    const segments = template.segments
      .map((segment) =>
        segment.kind === 'var'
          ? `{${escapeSegment(segment.value)}}`
          : escapeSegment(segment.value)
      )
      .join('/');
    return `${template.prefix}:${segments}`;
  }
  matchTemplate(category: string, key: string): MessageKeyTemplate | false {
    const keyAsTemplate = this.parseTemplate(key);
    if (!keyAsTemplate) {
      return false;
    }
    const templates = this.store.getTemplates(category);
    if (!templates) {
      return false;
    }
    for (const template of templates) {
      const matched = fuzzyMatchTemplate(
        this.keyVarValidator,
        template,
        keyAsTemplate
      );
      if (matched) {
        return template;
      }
    }
    return false;
  }
  parseKey(category: string, key: string): false | MessageKey {
    {
      if (!isKeySafe(key)) {
        return false;
      }
      const matchedTemplate = this.matchTemplate(category, key);
      if (!matchedTemplate) {
        return false;
      }
      const insideSlash = key.split('/');
      const [lead, ...pathParts] = insideSlash;
      if (!lead) {
        throw new Error(
          'It should not happen as the key already matches the template and should have a slash'
        );
      }

      const lastColon = lead.lastIndexOf(':') || 0; //should never be zero
      const firstSegment = lead.slice(lastColon + 1, lead.length);

      const rawSegments = [firstSegment, ...pathParts];
      let segments: KeySegment[] = [];
      for (const [idx, templateSegment] of matchedTemplate.segments.entries()) {
        const segment = {
          kind: templateSegment.kind,
          value: rawSegments[idx] || 'this-should-never-happen',
        };
        segments.push(segment);
      }
      const messageKey: MessageKey = {
        key,
        template: matchedTemplate,
        segments: segments,
      };
      return messageKey;
    }
  }
}
