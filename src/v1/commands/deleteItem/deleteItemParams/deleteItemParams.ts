import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, KeyInput } from 'v1'
import { parseEntityKeyInput } from 'v1/commands/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes'

import type { DeleteItemOptions } from '../options'

import { parseDeleteItemOptions } from './parseDeleteItemOptions'

/**
 * Builds a DELETE Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @param deleteItemOptions DeleteItemOptions
 * @return DeleteCommandInput
 */
export const deleteItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemOptions: DeleteItemOptions = {}
): DeleteCommandInput => {
  const validKeyInput = parseEntityKeyInput<ENTITY>(entity, input)

  // Important to do it before renaming as validKeyInput is muted (to improve?)
  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : undefined

  const renamedInput = renameSavedAsAttributes(entity.item, validKeyInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  const options = parseDeleteItemOptions(deleteItemOptions)

  return {
    TableName: entity.table.name,
    Key: primaryKey,
    ...options
  }
}
