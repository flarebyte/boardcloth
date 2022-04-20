import { z } from 'zod';

const portableSingle = z.object({
  kind: z.literal('single'),
  flags: z.string().array(),
  values: z.string().array(),
});

const portableSingleOptional = z.object({
  kind: z.literal('single-optional'),
  flags: z.string().array(),
  values: z.string().optional().array(),
});

const portableMultiple = z.object({
  kind: z.literal('multiple'),
  flags: z.string().array(),
  values: z.string().array().array(),
});

const portableColumn = z.discriminatedUnion('kind', [
  portableSingle,
  portableSingleOptional,
  portableMultiple,
]);

const portableTable = z.object({
  count: z.number().int().positive(),
  flags: z.string().array(),
  primaryKeys: z.string().array().nonempty().max(12),
  columns: z.record(portableColumn),
});

const integrity = z.object({
  hashCode: z.string().optional(),
  size: z.number().int().positive(),
  strategy: z.string(),
});
const portableBoardDocument = z.object({
  id: z.string(),
  scopes: z.string().array(),
  flags: z.string().array(),
  metadata: z.record(z.string()),
  prefixes: z.record(z.string()),
  tables: z.record(portableTable),
  integrity,
});

/**
 * @link https://cryptojs.gitbook.io/docs/
 */
