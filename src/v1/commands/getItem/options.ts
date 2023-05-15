import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import { EntityV2 } from 'v1/entity'
import { AnyAttributePath } from 'v1/commands/types/paths'

export interface GetItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: AnyAttributePath<ENTITY['item']>[]
}
