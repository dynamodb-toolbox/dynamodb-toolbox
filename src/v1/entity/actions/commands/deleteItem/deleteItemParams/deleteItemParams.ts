import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityParser } from 'v1/entity/actions/parse'
import type { KeyInput } from 'v1/entity/actions/parse'

import type { DeleteItemOptions } from '../options'
import { parseDeleteItemOptions } from './parseDeleteItemOptions'

export const deleteItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemOptions: OPTIONS = {} as OPTIONS
): DeleteCommandInput => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
