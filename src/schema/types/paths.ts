import type {
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  RecordSchema,
  ResolveStringSchema
} from '~/attributes/index.js'
import type { Extends, If } from '~/types/index.js'

export type CharsToEscape = '[' | ']' | '.'
export type StringToEscape = `${string}${CharsToEscape}${string}`

export type AppendKey<PATH extends string, KEY extends string> =
  | `${PATH}['${KEY}']`
  | If<Extends<KEY, StringToEscape>, never, `${PATH}.${KEY}`>

// string is there to simplify type-constraint checks when using Paths
export type Paths<SCHEMA extends AttrSchema = AttrSchema> = string &
  (SCHEMA extends ItemSchema
    ? ItemSchemaPaths<SCHEMA>
    : SCHEMA extends AttrSchema
      ? AttrPaths<SCHEMA>
      : never)

export type AttrPaths<ATTRIBUTE extends AttrSchema, ATTRIBUTE_PATH extends string = ''> =
  | (ATTRIBUTE extends AnySchema ? AnySchemaPaths<ATTRIBUTE_PATH> : never)
  | (ATTRIBUTE extends ListSchema ? ListSchemaPaths<ATTRIBUTE, ATTRIBUTE_PATH> : never)
  | (ATTRIBUTE extends MapSchema ? MapSchemaPaths<ATTRIBUTE, ATTRIBUTE_PATH> : never)
  | (ATTRIBUTE extends RecordSchema ? RecordSchemaPaths<ATTRIBUTE, ATTRIBUTE_PATH> : never)
  | (ATTRIBUTE extends AnyOfSchema ? AnyOfSchemaPaths<ATTRIBUTE, ATTRIBUTE_PATH> : never)

export type ItemSchemaPaths<SCHEMA extends ItemSchema = ItemSchema> = ItemSchema extends SCHEMA
  ? string
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
    ? ATTRIBUTE_PATH extends string
      ?
          | `['${ATTRIBUTE_PATH}']`
          | If<Extends<ATTRIBUTE_PATH, StringToEscape>, never, ATTRIBUTE_PATH>
          | AttrPaths<
              SCHEMA['attributes'][ATTRIBUTE_PATH],
              | `['${ATTRIBUTE_PATH}']`
              | If<Extends<ATTRIBUTE_PATH, StringToEscape>, never, ATTRIBUTE_PATH>
            >
      : never
    : never

type AnySchemaPaths<ATTRIBUTE_PATH extends string = ''> = `${ATTRIBUTE_PATH}${string}`

type ListSchemaPaths<
  ATTRIBUTE extends ListSchema,
  ATTRIBUTE_PATH extends string = ''
> = ListSchema extends ATTRIBUTE
  ? string
  :
      | `${ATTRIBUTE_PATH}[${number}]`
      | AttrPaths<ATTRIBUTE['elements'], `${ATTRIBUTE_PATH}[${number}]`>

type MapSchemaPaths<
  ATTRIBUTE extends MapSchema,
  ATTRIBUTE_PATH extends string = ''
> = MapSchema extends ATTRIBUTE
  ? string
  : {
      [KEY in keyof ATTRIBUTE['attributes'] & string]:
        | AppendKey<ATTRIBUTE_PATH, KEY>
        | AttrPaths<ATTRIBUTE['attributes'][KEY], AppendKey<ATTRIBUTE_PATH, KEY>>
    }[keyof ATTRIBUTE['attributes'] & string]

type RecordSchemaPaths<
  ATTRIBUTE extends RecordSchema,
  ATTRIBUTE_PATH extends string = '',
  RESOLVED_KEYS extends string = ResolveStringSchema<ATTRIBUTE['keys']>
> = RecordSchema extends ATTRIBUTE
  ? string
  :
      | AppendKey<ATTRIBUTE_PATH, RESOLVED_KEYS>
      | AttrPaths<ATTRIBUTE['elements'], AppendKey<ATTRIBUTE_PATH, RESOLVED_KEYS>>

type AnyOfSchemaPaths<
  ATTRIBUTE extends AnyOfSchema,
  ATTRIBUTE_PATH extends string = ''
> = AnyOfSchema extends ATTRIBUTE
  ? string
  : AnyOfSchemaPathsRec<ATTRIBUTE['elements'], ATTRIBUTE_PATH>

type AnyOfSchemaPathsRec<
  ATTRIBUTES extends AttrSchema[],
  ATTRIBUTE_PATH extends string = '',
  RESULTS = never
> = ATTRIBUTES extends [infer ATTRIBUTES_HEAD, ...infer ATTRIBUTES_TAIL]
  ? ATTRIBUTES_HEAD extends AttrSchema
    ? ATTRIBUTES_TAIL extends AttrSchema[]
      ? AnyOfSchemaPathsRec<
          ATTRIBUTES_TAIL,
          ATTRIBUTE_PATH,
          RESULTS | AttrPaths<ATTRIBUTES_HEAD, ATTRIBUTE_PATH>
        >
      : never
    : never
  : RESULTS
