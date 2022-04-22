import { z } from 'zod';
const flags = z.string().array();

const portableSingle = z.object({
  kind: z.literal('single'),
  flags,
  values: z.string().array(),
});

const portableSingleOptional = z.object({
  kind: z.literal('single-optional'),
  flags,
  values: z.string().optional().array(),
});

const portableMultiple = z.object({
  kind: z.literal('multiple'),
  flags,
  values: z.string().array().array(),
});

const portableColumn = z.discriminatedUnion('kind', [
  portableSingle,
  portableSingleOptional,
  portableMultiple,
]);

const portableTable = z.object({
  count: z.number().int().positive(),
  flags,
  primaryKeys: z.string().array().nonempty().max(12),
  columns: z.record(portableColumn),
});

/**
 * @link https://cryptojs.gitbook.io/docs/
 */
const integrity = z.object({
  sha256: z.string().optional(),
  size: z.number().int().positive(),
  strategy: z
    .union([z.literal('sha256'), z.literal('other')])
    .default('sha256'),
});

const portableBoardDocument = z.object({
  id: z.string(),
  scopes: z.string().array(),
  flags,
  tables: z.record(portableTable),
  integrity,
});

export const safeParse = (value: unknown) =>
  portableBoardDocument.safeParse(value);

/**
 * Model for a document that can be imported and exported
 */
export type PortableBoardDocument = z.infer<typeof portableBoardDocument>;
