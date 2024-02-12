import type { CapacityOption } from 'v1/operations/constants/options/capacity'
import type { EntityV2 } from 'v1/entity'
import type { AnyAttributePath } from 'v1/operations/types'

export interface GetItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: AnyAttributePath<ENTITY['schema']>[]
}
