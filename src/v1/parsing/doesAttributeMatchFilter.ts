import type { Attribute } from 'v1/schema'

import type { AttributeFilters } from './types'

export const doesAttributeMatchFilters = (
  attribute: Attribute,
  filters: AttributeFilters = {}
): boolean =>
  Object.entries(filters).every(
    ([key, value]) => attribute[key as keyof AttributeFilters] === value
  )
