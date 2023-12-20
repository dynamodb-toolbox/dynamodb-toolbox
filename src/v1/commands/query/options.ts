import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type {
  SelectOption,
  AllProjectedAttributesSelectOption,
  SpecificAttributesSelectOption
} from 'v1/commands/constants/options/select'
import type { Condition, Query, AnyCommonAttributePath } from 'v1/commands/types'
import type { TableV2 } from 'v1/table'
import type { EntityV2 } from 'v1/entity'

export type QueryOptions<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  QUERY extends Query<TABLE> = Query<TABLE>
> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  maxPages?: number
  reverse?: boolean
  filters?: EntityV2[] extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES[number] as ENTITY['name']]?: Condition<ENTITY> }
} & (QUERY['index'] extends string
  ? {
      // consistent must be false if a secondary index is queried
      consistent?: false
      select?: SelectOption
    }
  : {
      consistent?: boolean
      // "ALL_PROJECTED_ATTRIBUTES" is only available if a secondary index is queried
      select?: Exclude<SelectOption, AllProjectedAttributesSelectOption>
    }) &
  (
    | { attributes?: undefined; select?: SelectOption }
    | {
        attributes: AnyCommonAttributePath<ENTITIES>[]
        // "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
        select?: SpecificAttributesSelectOption
      }
  )
