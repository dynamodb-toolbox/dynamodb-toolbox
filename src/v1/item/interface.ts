import { MapAttributeAttributes, RequiredOption } from './attributes'

export interface Item<
  MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'item'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: MAP_ATTRIBUTE_ATTRIBUTES
}
