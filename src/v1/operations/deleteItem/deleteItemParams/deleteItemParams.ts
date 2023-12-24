import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/operations/types'
import { parseEntityKeyInput } from 'v1/operations/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { collapseSchemaParsedInput } from 'v1/validation/collapseParsedInput'

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
  const collapsedInput = collapseSchemaParsedInput(validKeyInput)

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
