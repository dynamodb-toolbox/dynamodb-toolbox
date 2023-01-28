import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, KeyInput } from 'v1'
import { parseEntityKeyInput } from 'v1/commands/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes'

/**
 * Builds a DELETE Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @return DeleteCommandInput
 */
export const deleteItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>
): DeleteCommandInput => {
  const validKeyInput = parseEntityKeyInput<ENTITY>(entity, input)

  // Important to do it before renaming as validKeyInput is muted (to improve?)
  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : undefined

  const renamedInput = renameSavedAsAttributes(entity.item, validKeyInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  return {
    TableName: entity.table.name,
    Key: primaryKey
  }
}
