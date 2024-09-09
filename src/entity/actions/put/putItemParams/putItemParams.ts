import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse/index.js'
import type { Entity } from '~/entity/index.js'

import type { PutItemOptions } from '../options.js'
import type { PutItemInput } from '../types.js'
import { parsePutItemOptions } from './parsePutItemOptions.js'

type PutItemParamsGetter = <ENTITY extends Entity, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemOptions?: OPTIONS
) => PutCommandInput

export const putItemParams: PutItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends PutItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  options: OPTIONS = {} as OPTIONS
) => {
  const { item } = entity.build(EntityParser).parse(input)
  const awsOptions = parsePutItemOptions(entity, options)

  return {
    TableName: options.tableName ?? entity.table.getName(),
    Item: item,
    ...awsOptions
  }
}
