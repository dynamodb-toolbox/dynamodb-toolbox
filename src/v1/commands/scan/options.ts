import type { U } from 'ts-toolbelt'

import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type {
  SelectOption,
  AllProjectedAttributesSelectOption,
  SpecificAttributesSelectOption
} from 'v1/commands/constants/options/select'
import type { AnyAttributePath, Condition } from 'v1/commands/types'
import type { TableV2, IndexNames } from 'v1/table'
import type { EntityV2 } from 'v1/entity'

export type ScanOptions<TABLE extends TableV2 = TableV2, ENTITIES extends EntityV2 = EntityV2> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  filters?: EntityV2 extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES as ENTITY['name']]?: Condition<ENTITY> }
} & (
  | { segment?: never; totalSegments?: never }
  // Either both segment & totalSegments are set, either none
  | { segment: number; totalSegments: number }
) &
  (
    | {
        consistent?: boolean
        // "ALL_PROJECTED_ATTRIBUTES" is only available if index is present
        select?: Exclude<SelectOption, AllProjectedAttributesSelectOption>
        index?: undefined
      }
    | {
        // consistent must be false if an index is present
        consistent?: false
        select?: SelectOption
        index: IndexNames<TABLE>
      }
  ) &
  (
    | { attributes?: undefined; select?: SelectOption }
    | {
        attributes: EntityV2 extends ENTITIES
          ? Condition
          : U.IntersectOf<
              ENTITIES extends infer ENTITY
                ? ENTITY extends EntityV2
                  ? AnyAttributePath<ENTITY>[]
                  : never
                : never
            >
        //  "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
        select?: SpecificAttributesSelectOption
      }
  )
