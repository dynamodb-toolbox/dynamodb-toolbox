import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { Parser } from 'v1/schema/actions/parse'

import type { PutItemInput } from '../types'
import type { PutItemOptions } from '../options'

import { parsePutItemOptions } from './parsePutItemOptions'

export const putItemParams = <ENTITY extends EntityV2, OPTIONS extends PutItemOptions<ENTITY>>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemOptions: OPTIONS = {} as OPTIONS
): PutCommandInput => {
  const workflow = entity.schema.build(Parser).workflow(input)

  workflow.next() // defaulted
  workflow.next() // linked
  const validInput = workflow.next().value
  const transformedInput = workflow.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : transformedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parsePutItemOptions(entity, putItemOptions)

  return {
    TableName: entity.table.getName(),
    Item: { ...transformedInput, ...primaryKey },
    ...options
  }
}
