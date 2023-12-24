import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { collapseSchemaParsedInput } from 'v1/validation/collapseParsedInput'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'

import type { PutItemInput } from '../types'
import type { PutItemOptions } from '../options'

import { parseEntityPutCommandInput } from './parsePutCommandInput'
import { parsePutItemOptions } from './parsePutItemOptions'

export const putItemParams = <ENTITY extends EntityV2, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemOptions: OPTIONS = {} as OPTIONS
): PutCommandInput => {
  const validInput = parseEntityPutCommandInput(entity, input)
  const collapsedInput = collapseSchemaParsedInput(validInput)

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parsePutItemOptions(entity, putItemOptions)

  return {
    TableName: entity.table.getName(),
    Item: { ...collapsedInput, ...primaryKey },
    ...options
  }
}
