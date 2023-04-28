import type { RequiredOption } from 'v1/item'

export interface AttributeFilters {
  key?: boolean
}

export interface ParsingOptions {
  requiringOptions: Set<RequiredOption>
  filters?: AttributeFilters
}
