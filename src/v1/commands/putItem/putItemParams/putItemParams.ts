import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, PutItemInput } from 'v1/entity'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes'

import type { PutItemOptions } from '../options'

import { parseEntityPutCommandInput } from './parsePutCommandInput'
import { parsePutItemOptions } from './parsePutItemOptions'

export const putItemParams = <ENTITY extends EntityV2, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY, false>,
  putItemOptions: OPTIONS = {} as OPTIONS
): PutCommandInput => {
  const validInput = parseEntityPutCommandInput(entity, input)
  const renamedInput = renameSavedAsAttributes(validInput)

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : renamedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parsePutItemOptions(entity, putItemOptions)

  return {
    TableName: entity.table.name,
    Item: { ...renamedInput, ...primaryKey },
    ...options
  }
}
