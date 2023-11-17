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

export type QueryOptions<TABLE extends TableV2 = TableV2, ENTITIES extends EntityV2 = EntityV2> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  reverse?: boolean
  filters?: EntityV2 extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES as ENTITY['name']]?: Condition<ENTITY> }
} & (
  | {
      consistent?: boolean
      // "ALL_PROJECTED_ATTRIBUTES" is only available if indexName is present
      select?: Exclude<SelectOption, AllProjectedAttributesSelectOption>
      indexName?: undefined
    }
  | {
      // consistent must be false if an indexName is present
      consistent?: false
      select?: SelectOption
      indexName: IndexNames<TABLE>
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
