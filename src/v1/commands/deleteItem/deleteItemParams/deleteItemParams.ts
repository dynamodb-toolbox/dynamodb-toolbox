import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, KeyInput } from 'v1/entity'
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
export const deleteItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemOptions: OPTIONS = {} as OPTIONS
): DeleteCommandInput => {
  const validKeyInput = parseEntityKeyInput(entity, input)

  /**
   * @debt bug "Important to do it before renaming as validKeyInput is muted (to improve?). But will cause a bug with anyOf attributes (input is not actually the valid input)"
   */
  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : undefined

  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  const renamedInput = renameSavedAsAttributes(entity.schema, validKeyInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  return {
    TableName: entity.table.name,
    Key: primaryKey,
    ...options
  }
}
