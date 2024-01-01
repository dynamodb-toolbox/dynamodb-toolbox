import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity/class'
import type { KeyInput } from 'v1/operations/types'
import { parseEntityKeyInput } from 'v1/operations/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { collapseSchemaParsedInput } from 'v1/validation/collapseParsedInput'

import type { GetItemOptions } from '../options'

import { parseGetItemOptions } from './parseGetItemOptions'

export const getItemParams = <ENTITY extends EntityV2, OPTIONS extends GetItemOptions<ENTITY>>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemOptions: OPTIONS = {} as OPTIONS
): GetCommandInput => {
  const validKeyInput = parseEntityKeyInput(entity, input)
  const collapsedInput = collapseSchemaParsedInput(entity.schema, validKeyInput)

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parseGetItemOptions(entity, getItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
