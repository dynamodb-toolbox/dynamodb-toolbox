import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type { AnyAttributePath, Condition } from 'v1/commands/types'
import type { EntityV2 } from 'v1/entity'

import type {
  SelectOption,
  AllProjectedAttributesSelectOption,
  SpecificAttributesSelectOption
} from './constants'

export type ScanOptions<ENTITIES extends EntityV2 = EntityV2> = {
  capacity?: CapacityOption
  consistent?: boolean
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  filters?: EntityV2 extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES as ENTITY['name']]: Condition<ENTITY> }
} & (
  | { segment?: never; totalSegments?: never }
  // Either both segment & totalSegments are set, either none
  | { segment: number; totalSegments: number }
) &
  (
    | { select?: Exclude<SelectOption, AllProjectedAttributesSelectOption>; indexName?: string }
    // "ALL_PROJECTED_ATTRIBUTES" is only available if indexName is present
    | { select?: SelectOption; indexName: string }
  ) &
  (
    | { attributes?: undefined; select?: SelectOption }
    //  "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
    | {
        attributes: EntityV2 extends ENTITIES
          ? Record<string, Condition>
          : { [ENTITY in ENTITIES as ENTITY['name']]: AnyAttributePath<ENTITY>[] }
        select?: SpecificAttributesSelectOption
      }
  )
