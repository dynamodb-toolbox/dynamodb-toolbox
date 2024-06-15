import type { TableV2 } from 'v1/table'
import type { IndexNames } from 'v1/table/actions/indexes'
import type { EntityV2 } from 'v1/entity'
import type { EntityPathsIntersection } from 'v1/entity/actions/parsePaths'
import type { Condition } from 'v1/entity/actions/parseCondition'
import type { CapacityOption } from 'v1/options/capacity'
import type {
  SelectOption,
  AllProjectedAttributesSelectOption,
  SpecificAttributesSelectOption
} from 'v1/options/select'

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
        attributes: EntityPathsIntersection<ENTITIES>[]
        // "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
        select?: SpecificAttributesSelectOption
      }
  )
