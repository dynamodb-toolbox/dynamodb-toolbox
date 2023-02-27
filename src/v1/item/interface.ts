import { MapAttributeAttributes, RequiredOption } from './attributes'

export interface Item<
  MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'item'
  keyAttributesNames: Set<string>
  requiredAttributesNames: Record<RequiredOption, Set<string>>
  attributes: MAP_ATTRIBUTE_ATTRIBUTES
}
