import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity/index.js'
import { EntityParser } from 'v1/entity/actions/parse.js'
import type { KeyInput } from 'v1/entity/actions/parse.js'

import type { GetItemOptions } from '../options.js'

import { parseGetItemOptions } from './parseGetItemOptions.js'

export const getItemParams = <ENTITY extends EntityV2, OPTIONS extends GetItemOptions<ENTITY>>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemOptions: OPTIONS = {} as OPTIONS
): GetCommandInput => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseGetItemOptions(entity, getItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
