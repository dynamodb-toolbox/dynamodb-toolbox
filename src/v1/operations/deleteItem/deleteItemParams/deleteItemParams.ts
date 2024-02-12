import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/operations/types'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
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
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'key',
    transform: true,
    filters: { key: true },
    requiringOptions: new Set(['always'])
  })

  workflow.next() // defaulted
  workflow.next() // linked
  const validKeyInput = workflow.next().value
  const transformedInput = workflow.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parseDeleteItemOptions(entity, deleteItemOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
