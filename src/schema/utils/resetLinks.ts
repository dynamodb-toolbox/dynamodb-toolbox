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

export type ResetLinks<ATTRIBUTE extends AttrSchema> =
  | (ATTRIBUTE extends AnySchema
      ? AnySchema<{
          [KEY in Exclude<
            keyof ATTRIBUTE['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['props'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends NullSchema
      ? NullSchema<{
          [KEY in Exclude<
            keyof ATTRIBUTE['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['props'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends BooleanSchema
      ? BooleanSchema<{
          [KEY in Exclude<
            keyof ATTRIBUTE['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['props'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends NumberSchema
      ? NumberSchema<{
          [KEY in Exclude<
            keyof ATTRIBUTE['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['props'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends StringSchema
      ? StringSchema<{
          [KEY in Exclude<
            keyof ATTRIBUTE['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['props'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends BinarySchema
      ? BinarySchema<{
          [KEY in Exclude<
            keyof ATTRIBUTE['props'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['props'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends SetSchema
      ? SetSchema<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['props'][KEY]
          },
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends ListSchema
      ? ListSchema<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['props'][KEY]
          },
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends MapSchema
      ? MapSchema<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['props'][KEY]
          },
          ATTRIBUTE['attributes']
        >
      : never)
  | (ATTRIBUTE extends RecordSchema
      ? RecordSchema<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['props'][KEY]
          },
          ATTRIBUTE['keys'],
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends AnyOfSchema
      ? AnyOfSchema<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['props'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['props'][KEY]
          },
          ATTRIBUTE['elements']
        >
      : never)

type LinksResetter = <ATTRIBUTE extends AttrSchema>(attribute: ATTRIBUTE) => ResetLinks<ATTRIBUTE>

export const resetLinks: LinksResetter = attribute =>
  (attribute as AttrSchema_)
    // @ts-expect-error Signatures don't match but we don't care
    .clone({ keyLink: undefined, putLink: undefined, updateLink: undefined })
