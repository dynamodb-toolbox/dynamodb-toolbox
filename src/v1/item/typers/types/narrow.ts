import { MappedProperties, Property } from './property'

/**
 * Utility type to narrow the inferred properties of a map or item
 *
 * @param PropertyInput MappedProperties | Property
 * @return MappedProperties | Property
 */
export type Narrow<PropertyInput extends MappedProperties | Property> = {
  [PropertyProperty in keyof PropertyInput]: PropertyInput[PropertyProperty] extends
    | MappedProperties
    | Property
    ? Narrow<PropertyInput[PropertyProperty]>
    : PropertyInput[PropertyProperty]
}
