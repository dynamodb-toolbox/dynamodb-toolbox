import type {
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  AttrSchema_,
  BinarySchema,
  BooleanSchema,
  ListSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
  RecordSchema,
  SetSchema,
  StringSchema
} from '~/attributes/index.js'

export type ResetLinks<SCHEMA extends AttrSchema> =
  | (SCHEMA extends AnySchema
      ? AnySchema<{
          [KEY in Exclude<
            keyof SCHEMA['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: SCHEMA['props'][KEY]
        }>
      : never)
  | (SCHEMA extends NullSchema
      ? NullSchema<{
          [KEY in Exclude<
            keyof SCHEMA['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: SCHEMA['props'][KEY]
        }>
      : never)
  | (SCHEMA extends BooleanSchema
      ? BooleanSchema<{
          [KEY in Exclude<
            keyof SCHEMA['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: SCHEMA['props'][KEY]
        }>
      : never)
  | (SCHEMA extends NumberSchema
      ? NumberSchema<{
          [KEY in Exclude<
            keyof SCHEMA['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: SCHEMA['props'][KEY]
        }>
      : never)
  | (SCHEMA extends StringSchema
      ? StringSchema<{
          [KEY in Exclude<
            keyof SCHEMA['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: SCHEMA['props'][KEY]
        }>
      : never)
  | (SCHEMA extends BinarySchema
      ? BinarySchema<{
          [KEY in Exclude<
            keyof SCHEMA['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: SCHEMA['props'][KEY]
        }>
      : never)
  | (SCHEMA extends SetSchema
      ? SetSchema<
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          },
          SCHEMA['elements']
        >
      : never)
  | (SCHEMA extends ListSchema
      ? ListSchema<
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          },
          SCHEMA['elements']
        >
      : never)
  | (SCHEMA extends MapSchema
      ? MapSchema<
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          },
          SCHEMA['attributes']
        >
      : never)
  | (SCHEMA extends RecordSchema
      ? RecordSchema<
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          },
          SCHEMA['keys'],
          SCHEMA['elements']
        >
      : never)
  | (SCHEMA extends AnyOfSchema
      ? AnyOfSchema<
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          },
          SCHEMA['elements']
        >
      : never)

type LinksResetter = <SCHEMA extends AttrSchema>(schema: SCHEMA) => ResetLinks<SCHEMA>

export const resetLinks: LinksResetter = schema =>
  (schema as AttrSchema_)
    // @ts-expect-error Signatures don't match but we don't care
    .clone({ keyLink: undefined, putLink: undefined, updateLink: undefined })
