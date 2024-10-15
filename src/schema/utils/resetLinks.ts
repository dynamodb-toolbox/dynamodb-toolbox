import type {
  AnyAttribute,
  AnyAttribute_,
  AnyOfAttribute,
  AnyOfAttribute_,
  Attribute,
  Attribute_,
  BinaryAttribute,
  BinaryAttribute_,
  BooleanAttribute,
  BooleanAttribute_,
  ListAttribute,
  ListAttribute_,
  MapAttribute,
  MapAttribute_,
  NullAttribute,
  NullAttribute_,
  NumberAttribute,
  NumberAttribute_,
  RecordAttribute,
  RecordAttribute_,
  SetAttribute,
  SetAttribute_,
  StringAttribute,
  StringAttribute_
} from '~/attributes/index.js'
import type { Overwrite } from '~/types/index.js'

export type ResetLinks<ATTRIBUTE extends Attribute> =
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof AnyAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends NullAttribute
      ? NullAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof NullAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends BooleanAttribute
      ? BooleanAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof BooleanAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends NumberAttribute
      ? NumberAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof NumberAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends StringAttribute
      ? StringAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof StringAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends BinaryAttribute
      ? BinaryAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof BinaryAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends SetAttribute
      ? SetAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof SetAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends ListAttribute
      ? ListAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof ListAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? MapAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof MapAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['attributes']
        >
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? RecordAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof RecordAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['keys'],
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? AnyOfAttribute_<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof AnyOfAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['elements']
        >
      : never)

type LinksResetter = <ATTRIBUTE extends Attribute_>(attribute: ATTRIBUTE) => ResetLinks<ATTRIBUTE>

export const resetLinks: LinksResetter = attribute =>
  // @ts-expect-error
  attribute.clone({ links: { key: undefined, put: undefined, update: undefined } })
