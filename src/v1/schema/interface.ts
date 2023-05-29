import { MapAttributeAttributes, RequiredOption } from './attributes'

export interface Schema<
  MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'schema'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: MAP_ATTRIBUTE_ATTRIBUTES
}
