import type { RequiredOption } from '~/attributes/constants/requiredOptions.js'
import type { AttrSchema } from '~/attributes/index.js'

export interface EntityAttributes {
  [KEY: string]: AttrSchema
}

export interface SchemaOf<ATTRIBUTES extends EntityAttributes> {
  attributes: ATTRIBUTES

  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
}
