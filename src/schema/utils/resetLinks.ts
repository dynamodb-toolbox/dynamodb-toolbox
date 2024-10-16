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
import type { Overwrite } from '~/types/index.js'

export type ResetLinks<ATTRIBUTE extends Attribute> =
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof AnyAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends NullAttribute
      ? NullAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof NullAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends BooleanAttribute
      ? BooleanAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof BooleanAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends NumberAttribute
      ? NumberAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof NumberAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends StringAttribute
      ? StringAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof StringAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends BinaryAttribute
      ? BinaryAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof BinaryAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >
        >
      : never)
  | (ATTRIBUTE extends SetAttribute
      ? SetAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof SetAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends ListAttribute
      ? ListAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof ListAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? MapAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof MapAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['attributes']
        >
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? RecordAttribute<
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
      ? AnyOfAttribute<
          Overwrite<
            // Improves type display
            Pick<ATTRIBUTE, keyof AnyOfAttribute>,
            { links: { key: undefined; put: undefined; update: undefined } }
          >,
          ATTRIBUTE['elements']
        >
      : never)

type LinksResetter = <ATTRIBUTE extends Attribute>(attribute: ATTRIBUTE) => ResetLinks<ATTRIBUTE>

export const resetLinks: LinksResetter = attribute =>
  (attribute as Attribute_)
    // @ts-expect-error Signatures don't match but we don't care
    .clone({ links: { key: undefined, put: undefined, update: undefined } })
