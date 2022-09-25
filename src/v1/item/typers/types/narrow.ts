import { MappedAttributes, Attribute } from './attribute'

/**
 * Utility type to narrow the inferred attributes of a map or item
 *
 * @param AttributeInput MappedAttributes | Attribute
 * @return MappedAttributes | Attribute
 */
export type Narrow<AttributeInput extends MappedAttributes | Attribute> = {
  [AttributeProperty in keyof AttributeInput]: AttributeInput[AttributeProperty] extends
    | MappedAttributes
    | Attribute
    ? Narrow<AttributeInput[AttributeProperty]>
    : AttributeInput[AttributeProperty]
}
