import type {
  AnyOfSchema,
  AnySchema,
  BinarySchema,
  BooleanSchema,
  ListSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
  RecordSchema,
  Schema,
  Schema_,
  SetSchema,
  StringSchema
} from '~/attributes/index.js'

export type ResetLinks<SCHEMA extends Schema> =
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
          SCHEMA['elements'],
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          }
        >
      : never)
  | (SCHEMA extends ListSchema
      ? ListSchema<
          SCHEMA['elements'],
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          }
        >
      : never)
  | (SCHEMA extends MapSchema
      ? MapSchema<
          SCHEMA['attributes'],
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          }
        >
      : never)
  | (SCHEMA extends RecordSchema
      ? RecordSchema<
          SCHEMA['keys'],
          SCHEMA['elements'],
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          }
        >
      : never)
  | (SCHEMA extends AnyOfSchema
      ? AnyOfSchema<
          SCHEMA['elements'],
          {
            [KEY in Exclude<
              keyof SCHEMA['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: SCHEMA['props'][KEY]
          }
        >
      : never)

type LinksResetter = <SCHEMA extends Schema>(schema: SCHEMA) => ResetLinks<SCHEMA>

export const resetLinks: LinksResetter = schema =>
  (schema as Schema_)
    // @ts-expect-error Signatures don't match but we don't care
    .clone({ keyLink: undefined, putLink: undefined, updateLink: undefined })
