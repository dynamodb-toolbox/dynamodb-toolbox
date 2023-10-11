import { $MapAttributeAttributes, $Attribute, MapAttributeAttributes, Attribute } from './attribute'

/**
 * Utility type to narrow the inferred attributes of a map or item
 *
 * @param $ATTRIBUTE $MapAttributeAttributes | $Attribute
 * @return $MapAttributeAttributes | $Attribute
 */
export type $Narrow<$ATTRIBUTE extends $MapAttributeAttributes | $Attribute> = {
  [PROPERTY in keyof $ATTRIBUTE]: $ATTRIBUTE[PROPERTY] extends $MapAttributeAttributes | $Attribute
    ? $Narrow<$ATTRIBUTE[PROPERTY]>
    : $ATTRIBUTE[PROPERTY]
}

/**
 * Utility type to narrow the inferred attributes of a map or item
 *
 * @param ATTRIBUTE MapAttributeAttributes | Attribute
 * @return MapAttributeAttributes | Attribute
 */
export type Narrow<ATTRIBUTE extends MapAttributeAttributes | Attribute> = {
  [PROPERTY in keyof ATTRIBUTE]: ATTRIBUTE[PROPERTY] extends MapAttributeAttributes | Attribute
    ? Narrow<ATTRIBUTE[PROPERTY]>
    : ATTRIBUTE[PROPERTY]
}
