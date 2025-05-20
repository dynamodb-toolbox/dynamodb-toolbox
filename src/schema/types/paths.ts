import type {
  AnyOfSchema,
  AnySchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  RecordSchema,
  ResolveStringSchema,
  Schema
} from '~/schema/index.js'
import type { Extends, If } from '~/types/index.js'

export type CharsToEscape = '[' | ']' | '.'
export type StringToEscape = `${string}${CharsToEscape}${string}`

export type AppendKey<PATH extends string, KEY extends string> =
  | `${PATH}['${KEY}']`
  | If<Extends<KEY, StringToEscape>, never, `${PATH}.${KEY}`>

// string is there to simplify type-constraint checks when using Paths
export type Paths<SCHEMA extends Schema = Schema> = string &
  (SCHEMA extends ItemSchema
    ? ItemSchemaPaths<SCHEMA>
    : SCHEMA extends Schema
      ? SchemaPaths<SCHEMA>
      : never)

export type SchemaPaths<SCHEMA extends Schema, SCHEMA_PATH extends string = ''> =
  | (SCHEMA extends AnySchema ? AnySchemaPaths<SCHEMA_PATH> : never)
  | (SCHEMA extends ListSchema ? ListSchemaPaths<SCHEMA, SCHEMA_PATH> : never)
  | (SCHEMA extends MapSchema ? MapSchemaPaths<SCHEMA, SCHEMA_PATH> : never)
  | (SCHEMA extends RecordSchema ? RecordSchemaPaths<SCHEMA, SCHEMA_PATH> : never)
  | (SCHEMA extends AnyOfSchema ? AnyOfSchemaPaths<SCHEMA, SCHEMA_PATH> : never)

export type ItemSchemaPaths<SCHEMA extends ItemSchema = ItemSchema> = ItemSchema extends SCHEMA
  ? string
  : keyof SCHEMA['attributes'] extends infer SCHEMA_PATH
    ? SCHEMA_PATH extends string
      ?
          | `['${SCHEMA_PATH}']`
          | If<Extends<SCHEMA_PATH, StringToEscape>, never, SCHEMA_PATH>
          | SchemaPaths<
              SCHEMA['attributes'][SCHEMA_PATH],
              `['${SCHEMA_PATH}']` | If<Extends<SCHEMA_PATH, StringToEscape>, never, SCHEMA_PATH>
            >
      : never
    : never

type AnySchemaPaths<SCHEMA_PATH extends string = ''> =
  | SCHEMA_PATH
  | `${SCHEMA_PATH}.${string}`
  | `${SCHEMA_PATH}[${string}`

type ListSchemaPaths<
  SCHEMA extends ListSchema,
  SCHEMA_PATH extends string = ''
> = ListSchema extends SCHEMA
  ? string
  : `${SCHEMA_PATH}[${number}]` | SchemaPaths<SCHEMA['elements'], `${SCHEMA_PATH}[${number}]`>

type MapSchemaPaths<
  SCHEMA extends MapSchema,
  SCHEMA_PATH extends string = ''
> = MapSchema extends SCHEMA
  ? string
  : {
      [KEY in keyof SCHEMA['attributes'] & string]:
        | AppendKey<SCHEMA_PATH, KEY>
        | SchemaPaths<SCHEMA['attributes'][KEY], AppendKey<SCHEMA_PATH, KEY>>
    }[keyof SCHEMA['attributes'] & string]

type RecordSchemaPaths<
  SCHEMA extends RecordSchema,
  SCHEMA_PATH extends string = '',
  RESOLVED_KEYS extends string = ResolveStringSchema<SCHEMA['keys']>
> = RecordSchema extends SCHEMA
  ? string
  :
      | AppendKey<SCHEMA_PATH, RESOLVED_KEYS>
      | SchemaPaths<SCHEMA['elements'], AppendKey<SCHEMA_PATH, RESOLVED_KEYS>>

type AnyOfSchemaPaths<
  SCHEMA extends AnyOfSchema,
  SCHEMA_PATH extends string = ''
> = AnyOfSchema extends SCHEMA ? string : AnyOfSchemaPathsRec<SCHEMA['elements'], SCHEMA_PATH>

type AnyOfSchemaPathsRec<
  SCHEMAS extends Schema[],
  SCHEMA_PATH extends string = '',
  RESULTS = never
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? AnyOfSchemaPathsRec<
          SCHEMAS_TAIL,
          SCHEMA_PATH,
          RESULTS | SchemaPaths<SCHEMAS_HEAD, SCHEMA_PATH>
        >
      : never
    : never
  : RESULTS
