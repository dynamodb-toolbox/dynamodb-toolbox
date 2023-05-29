import type { RequiredOption } from 'v1/schema'

export interface AttributeFilters {
  key?: boolean
}

export interface ParsingOptions {
  requiringOptions?: Set<RequiredOption>
  filters?: AttributeFilters
}
