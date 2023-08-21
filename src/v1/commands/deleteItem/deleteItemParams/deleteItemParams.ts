import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/commands/types'
import { parseEntityKeyInput } from 'v1/commands/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/validation/renameSavedAsAttributes'

import type { DeleteItemOptions } from '../options'

import { parseDeleteItemOptions } from './parseDeleteItemOptions'

export const deleteItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemOptions: OPTIONS = {} as OPTIONS
): DeleteCommandInput => {
  const validKeyInput = parseEntityKeyInput(entity, input)
  const renamedInput = renameSavedAsAttributes(validKeyInput)

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : renamedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  return {
    TableName: entity.table.name,
    Key: primaryKey,
    ...options
  }
}
