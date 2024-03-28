import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { PrimaryKeyParser } from 'v1/table/actions/parsePrimaryKey'
import type { EntityV2 } from 'v1/entity'
import { Parser } from 'v1/schema/actions/parse'
import type { KeyInput } from 'v1/operations/types'

import type { GetItemOptions } from '../options'

import { parseGetItemOptions } from './parseGetItemOptions'

export const getItemParams = <ENTITY extends EntityV2, OPTIONS extends GetItemOptions<ENTITY>>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemOptions: OPTIONS = {} as OPTIONS
): GetCommandInput => {
  const parser = entity.schema.build(Parser).start(input, { operation: 'key' })
  parser.next() // defaulted
  parser.next() // linked
  const validKeyInput = parser.next().value
  const transformedInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = entity.table.build(PrimaryKeyParser).parse(keyInput)

  const options = parseGetItemOptions(entity, getItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
