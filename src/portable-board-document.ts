type PortableColumn =
  | {
      kind: 'single';
      flags: string[];
      values: string[];
    }
  | {
      kind: 'single-optional';
      flags: string[];
      values: (string | undefined)[];
    }
  | {
      kind: 'multiple';
      flags: string[];
      values: string[][];
    };

interface PortableTable {
  count: number;
  flags: string[];
  primaryKeys: string[];
  columns: { [key: string]: PortableColumn };
}
type IntegrityStrategy = 'SHA-1' | 'Keccak'

/**
 * @link https://cryptojs.gitbook.io/docs/
 */
interface PortableBoardDocument {
  id: string;
  integrity: {

    hashCode?: string;
    size: number;
  };
  scopes: string[];
  metadata: { [Key in string]: string };
  prefixes: { [Key in string]: string };
  flags: string[];
  tables: { [Key in string]: PortableTable };
}
