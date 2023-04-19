import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, KeyInput } from 'v1'
import { parseEntityKeyInput } from 'v1/commands/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes'

import type { GetItemOptions } from '../options'

import { parseGetItemOptions } from './parseGetItemOptions'

/**
 * Builds a GET Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @param getItemOptions GetItemOptions
 * @return GetCommandInput
 */
export const getItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemOptions: GetItemOptions = {}
): GetCommandInput => {
  const validKeyInput = parseEntityKeyInput(entity, input)

  /**
   * @debt bug "Important to do it before renaming as validKeyInput is muted (to improve?). But will cause a bug with anyOf attributes (input is not actually the valid input)"
   */
  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : undefined

  const renamedInput = renameSavedAsAttributes(entity.item, validKeyInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  const options = parseGetItemOptions(getItemOptions)

  return {
    TableName: entity.table.name,
    Key: primaryKey,
    ...options
  }
}
