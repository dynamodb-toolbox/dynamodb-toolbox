import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { EntityPathsIntersection } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type {
  AllProjectedAttributesSelectOption,
  SelectOption,
  SpecificAttributesSelectOption
} from '~/options/select.js'
import type { IndexNames } from '~/table/actions/indexes.js'
import type { Table } from '~/table/index.js'

export type ScanOptions<TABLE extends Table = Table, ENTITIES extends Entity[] = Entity[]> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  maxPages?: number
  filter?: Entity[] extends ENTITIES ? Condition : never
  filters?: Entity[] extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES[number] as ENTITY['entityName']]?: Condition<ENTITY> }
  entityAttrFilter?: boolean
  showEntityAttr?: boolean
  tableName?: string
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
        // consistent must be false if a secondary index is present
        consistent?: false
        select?: SelectOption
        index: IndexNames<TABLE, 'global'>
      }
    | {
        consistent?: boolean
        select?: SelectOption
        index: IndexNames<TABLE, 'local'>
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
