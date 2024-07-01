import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { Entity } from '~/entity/index.js'

import type { DeleteItemOptions } from '../options.js'
import { parseDeleteItemOptions } from './parseDeleteItemOptions.js'

type DeleteItemParamsGetter = <ENTITY extends Entity, OPTIONS extends DeleteItemOptions<ENTITY>>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemOptions?: OPTIONS
) => DeleteCommandInput

export const deleteItemParams: DeleteItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends DeleteItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemOptions: OPTIONS = {} as OPTIONS
) => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
