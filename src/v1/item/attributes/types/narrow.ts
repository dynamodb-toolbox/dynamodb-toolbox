import { MapAttributeAttributes, Attribute } from './attribute'

/**
 * Utility type to narrow the inferred attributes of a map or item
 *
 * @param AttributeInput MapAttributeAttributes | Attribute
 * @return MapAttributeAttributes | Attribute
 */
export type Narrow<AttributeInput extends MapAttributeAttributes | Attribute> = {
  [AttributeProperty in keyof AttributeInput]: AttributeInput[AttributeProperty] extends
    | MapAttributeAttributes
    | Attribute
    ? Narrow<AttributeInput[AttributeProperty]>
    : AttributeInput[AttributeProperty]
}
