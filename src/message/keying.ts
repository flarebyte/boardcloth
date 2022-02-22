interface MessageKeySegment {
  value: string;
  kind: 'const' | 'var';
}

interface MessageTemplateKey {
  prefix: string;
  segments: MessageKeySegment[];
}

const escapeSegment = (segment: string): string =>
  segment.replace(/[{}\/]/g, '');
const buildKeyTemplate = (template: MessageTemplateKey): string => {
  const segments = template.segments
    .map((segment) =>
      segment.kind === 'var'
        ? `{${escapeSegment(segment.value)}}`
        : escapeSegment(segment.value)
    )
    .join('/');
  return `${template.prefix}:${segments}`;
};

const parseKey = (value: string): MessageTemplateKey | undefined => {
  return undefined;
};
