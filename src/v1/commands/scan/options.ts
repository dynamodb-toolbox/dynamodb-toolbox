import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type {
  SelectOption,
  AllProjectedAttributesSelectOption,
  SpecificAttributesSelectOption
} from 'v1/commands/constants/options/select'
import type { Condition, AnyCommonAttributePath } from 'v1/commands/types'
import type { TableV2, IndexNames } from 'v1/table'
import type { EntityV2 } from 'v1/entity'

export type ScanOptions<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[]
> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  maxPages?: number
  filters?: EntityV2[] extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES[number] as ENTITY['name']]?: Condition<ENTITY> }
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
        attributes: AnyCommonAttributePath<ENTITIES>[]
        // "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
        select?: SpecificAttributesSelectOption
      }
  )
