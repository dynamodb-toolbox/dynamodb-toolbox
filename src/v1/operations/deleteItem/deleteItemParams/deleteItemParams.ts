import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/operations/types'
import { PrimaryKeyParser } from 'v1/operations/primaryKeyParser'
import { Parser } from 'v1/schema/actions/parse'

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
  const parser = entity.schema.build(Parser).start(input, { operation: 'key' })

  parser.next() // defaulted
  parser.next() // linked
  const validKeyInput = parser.next().value
  const transformedInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = entity.build(PrimaryKeyParser).parse(keyInput)

  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
