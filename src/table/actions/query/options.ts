import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { EntityPathsUnion } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { NoEntityMatchBehavior } from '~/options/noEntityMatchBehavior.js'
import type {
  AllProjectedAttributesSelectOption,
  SelectOption,
  SpecificAttributesSelectOption
} from '~/options/select.js'
import type { Table } from '~/table/index.js'

import type { Query } from './types.js'

export type QueryOptions<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  QUERY extends Query<TABLE> = Query<TABLE>
> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  maxPages?: number
  reverse?: boolean
  filter?: Entity[] extends ENTITIES ? Condition : never
  filters?: Entity[] extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES[number] as ENTITY['entityName']]?: Condition<ENTITY> }
  entityAttrFilter?: boolean
  noEntityMatchBehavior?: NoEntityMatchBehavior
  showEntityAttr?: boolean
  tagEntities?: boolean
  tableName?: string
} & (Table extends TABLE
  ? { consistent?: boolean; select?: SelectOption }
  : QUERY['index'] extends keyof TABLE['indexes']
    ? TABLE['indexes'][QUERY['index']]['type'] extends 'global'
      ? {
          // consistent must be false if a global secondary index is queried
          consistent?: false
          select?: SelectOption
        }
      : { consistent?: boolean; select?: SelectOption }
    : {
        consistent?: boolean
        // "ALL_PROJECTED_ATTRIBUTES" is only available if a secondary index is queried
        select?: Exclude<SelectOption, AllProjectedAttributesSelectOption>
      }) &
  (
    | { attributes?: undefined; select?: SelectOption }
    | {
        attributes: Entity[] extends ENTITIES ? string[] : EntityPathsUnion<ENTITIES>[]
        // "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
        select?: SpecificAttributesSelectOption
      }
  )
