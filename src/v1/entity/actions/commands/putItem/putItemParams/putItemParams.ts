import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityParser } from 'v1/entity/actions/parse'

import type { PutItemInput } from '../types'
import type { PutItemOptions } from '../options'

import { parsePutItemOptions } from './parsePutItemOptions'

export const putItemParams = <ENTITY extends EntityV2, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemOptions: OPTIONS = {} as OPTIONS
): PutCommandInput => {
  const { item } = entity.build(EntityParser).parse(input)
  const options = parsePutItemOptions(entity, putItemOptions)

  return {
    TableName: entity.table.getName(),
    Item: item,
    ...options
  }
}
