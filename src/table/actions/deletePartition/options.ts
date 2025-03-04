import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { NoEntityMatchBehavior } from '~/options/noEntityMatchBehavior.js'
import type { Query } from '~/table/actions/query/index.js'
import type { Table } from '~/table/index.js'

export type DeletePartitionOptions<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  QUERY extends Query<TABLE> = Query<TABLE>
> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  entityAttrFilter?: boolean
  noEntityMatchBehavior?: NoEntityMatchBehavior
  filters?: Entity[] extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES[number] as ENTITY['entityName']]?: Condition<ENTITY> }
  tableName?: string
} & (QUERY['index'] extends keyof TABLE['indexes']
  ? TABLE['indexes'][QUERY['index']]['type'] extends 'global'
    ? // consistent must be false if a global secondary index is queried
      { consistent?: false }
    : { consistent?: boolean }
  : { consistent?: boolean })
