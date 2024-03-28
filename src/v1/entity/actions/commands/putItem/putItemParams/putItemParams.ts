import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { PrimaryKeyParser } from 'v1/table/actions/primaryKeyParser'
import type { EntityV2 } from 'v1/entity'
import { Parser } from 'v1/schema/actions/parse'

import type { PutItemInput } from '../types'
import type { PutItemOptions } from '../options'

import { parsePutItemOptions } from './parsePutItemOptions'

export const putItemParams = <ENTITY extends EntityV2, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemOptions: OPTIONS = {} as OPTIONS
): PutCommandInput => {
  const parser = entity.schema.build(Parser).start(input)
  parser.next() // defaulted
  parser.next() // linked
  const validInput = parser.next().value
  const transformedInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : transformedInput
  const primaryKey = entity.table.build(PrimaryKeyParser).parse(keyInput)

  const options = parsePutItemOptions(entity, putItemOptions)

  return {
    TableName: entity.table.getName(),
    Item: { ...transformedInput, ...primaryKey },
    ...options
  }
}
