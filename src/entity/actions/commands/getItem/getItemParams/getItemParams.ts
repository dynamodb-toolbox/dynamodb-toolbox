import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { Entity } from '~/entity/index.js'

import type { GetItemOptions } from '../options.js'
import { parseGetItemOptions } from './parseGetItemOptions.js'

type GetItemParamsGetter = <ENTITY extends Entity, OPTIONS extends GetItemOptions<ENTITY>>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemOptions?: OPTIONS
) => GetCommandInput

export const getItemParams: GetItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends GetItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemOptions = {} as OPTIONS
) => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseGetItemOptions(entity, getItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
