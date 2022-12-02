import { _MapAttributeAttributes, _Attribute } from './attribute'

/**
 * Utility type to narrow the inferred attributes of a map or item
 *
 * @param AttributeInput MapAttributeAttributes | Attribute
 * @return MapAttributeAttributes | Attribute
 */
export type Narrow<AttributeInput extends _MapAttributeAttributes | _Attribute> = {
  [AttributeProperty in keyof AttributeInput]: AttributeInput[AttributeProperty] extends
    | _MapAttributeAttributes
    | _Attribute
    ? Narrow<AttributeInput[AttributeProperty]>
    : AttributeInput[AttributeProperty]
}
