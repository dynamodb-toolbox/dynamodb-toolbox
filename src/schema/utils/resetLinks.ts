import type {
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  Attribute_,
  BinaryAttribute,
  BooleanAttribute,
  ListAttribute,
  MapAttribute,
  NullAttribute,
  NumberAttribute,
  RecordAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'

export type ResetLinks<ATTRIBUTE extends Attribute> =
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttribute<{
          [KEY in Exclude<
            keyof ATTRIBUTE['state'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['state'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends NullAttribute
      ? NullAttribute<{
          [KEY in Exclude<
            keyof ATTRIBUTE['state'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['state'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends BooleanAttribute
      ? BooleanAttribute<{
          [KEY in Exclude<
            keyof ATTRIBUTE['state'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['state'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends NumberAttribute
      ? NumberAttribute<{
          [KEY in Exclude<
            keyof ATTRIBUTE['state'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['state'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends StringAttribute
      ? StringAttribute<{
          [KEY in Exclude<
            keyof ATTRIBUTE['state'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['state'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends BinaryAttribute
      ? BinaryAttribute<{
          [KEY in Exclude<
            keyof ATTRIBUTE['state'],
            'keyLink' | 'putLink' | 'updateLink'
          >]: ATTRIBUTE['state'][KEY]
        }>
      : never)
  | (ATTRIBUTE extends SetAttribute
      ? SetAttribute<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['state'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['state'][KEY]
          },
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends ListAttribute
      ? ListAttribute<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['state'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['state'][KEY]
          },
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? MapAttribute<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['state'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['state'][KEY]
          },
          ATTRIBUTE['attributes']
        >
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? RecordAttribute<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['state'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['state'][KEY]
          },
          ATTRIBUTE['keys'],
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? AnyOfAttribute<
          {
            [KEY in Exclude<
              keyof ATTRIBUTE['state'],
              'keyLink' | 'putLink' | 'updateLink'
            >]: ATTRIBUTE['state'][KEY]
          },
          ATTRIBUTE['elements']
        >
      : never)

type LinksResetter = <ATTRIBUTE extends Attribute>(attribute: ATTRIBUTE) => ResetLinks<ATTRIBUTE>

export const resetLinks: LinksResetter = attribute =>
  (attribute as Attribute_)
    // @ts-expect-error Signatures don't match but we don't care
    .clone({ keyLink: undefined, putLink: undefined, updateLink: undefined })
