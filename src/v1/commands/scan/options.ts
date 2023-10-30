import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type { Condition } from 'v1/commands/types/condition'
import type { EntityV2 } from 'v1/entity'

import type { SelectOption } from './constants'

export type ScanOptions<ENTITIES extends EntityV2 = EntityV2> = {
  capacity?: CapacityOption
  consistent?: boolean
  exclusiveStartKey?: Record<string, unknown>
  indexName?: string
  limit?: number
  select?: SelectOption
  filters?: EntityV2 extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES as ENTITY['name']]: Condition<ENTITY> }
  // Either both segment & totalSegments are set, either none
} & ({ segment?: never; totalSegments?: never } | { segment: number; totalSegments: number })
