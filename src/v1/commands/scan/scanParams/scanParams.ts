import type { ScanCommandInput } from '@aws-sdk/lib-dynamodb'

import type { TableV2 } from 'v1/table'
import { DynamoDBToolboxError } from 'v1/errors'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseIndexNameOption } from 'v1/commands/utils/parseOptions/parseIndexNameOption'
import { parseConsistentOption } from 'v1/commands/utils/parseOptions/parseConsistentOption'
import { parseLimitOption } from 'v1/commands/utils/parseOptions/parseLimitOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'
import { isInteger } from 'v1/utils/validation/isInteger'

import type { ScanOptions } from '../options'

import { selectOptionsSet } from '../constants'

export const scanParams = <TABLE extends TableV2, OPTIONS extends ScanOptions>(
  table: TABLE,
  scanOptions: OPTIONS = {} as OPTIONS
): ScanCommandInput => {
  const {
    capacity,
    consistent,
    exclusiveStartKey,
    indexName,
    limit,
    select,
    totalSegments,
    segment,
    ...extraOptions
  } = scanOptions

  const commandOptions: ScanCommandInput = {
    TableName: table.getName()
  }

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (consistent !== undefined) {
    commandOptions.ConsistentRead = parseConsistentOption(consistent)
  }

  if (exclusiveStartKey !== undefined) {
    commandOptions.ExclusiveStartKey = exclusiveStartKey
  }

  if (indexName !== undefined) {
    commandOptions.IndexName = parseIndexNameOption(indexName)
  }

  if (limit !== undefined) {
    commandOptions.Limit = parseLimitOption(limit)
  }

  if (select !== undefined) {
    if (!selectOptionsSet.has(select)) {
      throw new DynamoDBToolboxError('scanCommand.invalidSelectOption', {
        message: `Invalid select option: '${String(select)}'. 'select' must be one of: ${[
          ...selectOptionsSet
        ].join(', ')}.`,
        payload: { select }
      })
    }

    commandOptions.Select = select
  }

  if (segment !== undefined) {
    if (totalSegments === undefined) {
      throw new DynamoDBToolboxError('scanCommand.invalidSegmentOption', {
        message: 'If a segment option has been provided, totalSegments must also be defined',
        payload: {}
      })
    }

    if (!isInteger(totalSegments) || totalSegments < 1) {
      throw new DynamoDBToolboxError('scanCommand.invalidSegmentOption', {
        message: `Invalid totalSegments option: '${String(
          totalSegments
        )}'. 'totalSegments' must be a strictly positive integer.`,
        payload: { totalSegments }
      })
    }

    if (!isInteger(segment) || segment < 0 || segment >= totalSegments) {
      throw new DynamoDBToolboxError('scanCommand.invalidSegmentOption', {
        message: `Invalid segment option: '${String(
          segment
        )}'. 'segment' must be a positive integer strictly lower than 'totalSegments'.`,
        payload: { segment, totalSegments }
      })
    }

    commandOptions.TotalSegments = totalSegments
    commandOptions.Segment = segment
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
