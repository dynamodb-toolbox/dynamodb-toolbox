import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, PutItemInput } from 'v1/entity'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes'

import type { PutItemOptions } from '../options'

import { parseEntityPutCommandInput } from './parsePutCommandInput'
import { parsePutItemOptions } from './parsePutItemOptions'

/**
 * Builds a PUT Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @param putItemOptions PutItemOptions
 * @return PutCommandInput
 */
export const putItemParams = <ENTITY extends EntityV2, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY, false>,
  putItemOptions: OPTIONS = {} as OPTIONS
): PutCommandInput => {
  const validInput = parseEntityPutCommandInput<EntityV2>(entity, input)

  /**
   * @debt bug "Important to do it before renaming as validKeyInput is muted (to improve?). But will cause a bug with anyOf attributes (input is not actually the valid input)"
   */
  const keyInput = entity.computeKey ? entity.computeKey(validInput) : undefined

  const options = parsePutItemOptions(entity, putItemOptions)

  const renamedInput = renameSavedAsAttributes(entity.schema, validInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  return {
    TableName: entity.table.name,
    Item: { ...renamedInput, ...primaryKey },
    ...options
  }
}
