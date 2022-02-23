interface KeySegment {
  value: string;
  kind: 'const' | 'var';
}

interface MessageKeyTemplate {
  key: string;
  prefix: string;
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
  load(categoryAndTemplate: [string, string]): void;
}

export interface KeyTemplateBaseManager {
  parse(key: string): MessageKeyTemplate | false;
  build(template: MessageKeyTemplate): string;
  matchTemplate(templates: string[], key: string): string | false;
}

const isKeySafe = (key: string): boolean => /[A-Za-z0-9}{\/_-]{5,}/.test(key);

const fuzzyMatchTemplate = (
  template: MessageKeyTemplate,
  key: MessageKeyTemplate
): boolean => false;

export class KeyTemplateStore implements KeyTemplateBaseStore {
  load(categoryAndTemplate: [string, string]): void {
    throw new Error('Method not implemented.');
  }
}

export class KeyTemplateManager implements KeyTemplateBaseManager {
  store: KeyTemplateBaseStore;
  constructor(store: KeyTemplateBaseStore) {
    this.store = store;
  }
  parse(key: string): false | MessageKeyTemplate {
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
  }
  build(template: MessageKeyTemplate): string {
    const segments = template.segments
      .map((segment) =>
        segment.kind === 'var'
          ? `{${escapeSegment(segment.value)}}`
          : escapeSegment(segment.value)
      )
      .join('/');
    return `${template.prefix}:${segments}`;
  }
  matchTemplate(templates: string[], key: string): string | false {
    const keyAsTemplate = this.parse(key);
    if (!keyAsTemplate) {
      return false;
    }
    for (const template of templates) {
      const parsedTemplate = this.parse(template);
      if (!parsedTemplate) {
        return false;
      }
      const matched = fuzzyMatchTemplate(parsedTemplate, keyAsTemplate);
      if (matched) {
        return 'something';
      }
    }
    return false;
  }
}
