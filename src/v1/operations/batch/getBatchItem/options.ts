import type { EntityV2 } from 'v1/entity'
import type { CapacityOption } from 'v1/operations/constants/options/capacity'
import type { AnyAttributePath } from 'v1/operations/types'

export type BatchGetItemOptions<ENTITIES extends EntityV2[] = EntityV2[]> = {
  capacity?: CapacityOption
  attributes?: EntityV2[] extends ENTITIES
    ? Record<string, AnyAttributePath>
    : { [ENTITY in ENTITIES[number] as ENTITY['name']]?: AnyAttributePath<ENTITY> }
}
