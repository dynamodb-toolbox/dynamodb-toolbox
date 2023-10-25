import type { EntityV2 } from 'v1/entity'
import type { CapacityOption } from 'v1/commands/constants/options/capacity'

import type { SelectOption } from './constants'

export type ScanOptions<FILTERED_ENTITIES extends EntityV2 = EntityV2> = {
  capacity?: CapacityOption
  consistent?: boolean
  exclusiveStartKey?: Record<string, unknown>
  indexName?: string
  limit?: number
  select?: SelectOption
  filteredEntities?: FILTERED_ENTITIES[]
  // Either both segment & totalSegments are set, either none
} & ({ segment?: never; totalSegments?: never } | { segment: number; totalSegments: number })
