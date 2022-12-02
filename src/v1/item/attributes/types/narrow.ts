import { _MapAttributeAttributes, _Attribute } from './attribute'

/**
 * Utility type to narrow the inferred attributes of a map or item
 *
 * @param AttributeInput MapAttributeAttributes | Attribute
 * @return MapAttributeAttributes | Attribute
 */
export type Narrow<_ATTRIBUTE extends _MapAttributeAttributes | _Attribute> = {
  [PROPERTY in keyof _ATTRIBUTE]: _ATTRIBUTE[PROPERTY] extends _MapAttributeAttributes | _Attribute
    ? Narrow<_ATTRIBUTE[PROPERTY]>
    : _ATTRIBUTE[PROPERTY]
}
