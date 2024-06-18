import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { CapacityOption, parseCapacityOption } from 'v1/options/capacity'
import { $table } from 'v1/table/table'
import { $entity } from 'v1/entity'
import { EntityFormatter, FormattedItem } from 'v1/entity/actions/format'
import type { Paths } from 'v1/schema/actions/parsePaths'

import {
  BatchGetTableItemsRequest,
  BatchGetItemRequestProps,
  BatchGetTableItemsOptions,
  $requests,
  $options
} from './batchGetTableItems'

export interface BatchGetOptions {
  capacity?: CapacityOption
  documentClient?: DynamoDBDocumentClient
}

type BatchGetResponse<REQUESTS extends BatchGetTableItemsRequest[]> = Omit<
  BatchGetCommandOutput,
  'Responses'
> & { Responses: BatchGetResponses<REQUESTS> }

type BatchGetResponses<
  REQUESTS extends BatchGetTableItemsRequest[],
  RESPONSE extends unknown[] = []
> = REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAILS]
  ? REQUESTS_HEAD extends BatchGetTableItemsRequest
    ? REQUESTS_TAILS extends BatchGetTableItemsRequest[]
      ? BatchGetResponses<
          REQUESTS_TAILS,
          [
            ...RESPONSE,
            BatchGetResponseTableItems<
              NonNullable<REQUESTS_HEAD[$requests]>,
              REQUESTS_HEAD extends { [$options]: BatchGetTableItemsOptions }
                ? REQUESTS_HEAD[$options]
                : never
            >
          ]
        >
      : never
    : never
  : RESPONSE

type BatchGetResponseTableItems<
  REQUESTS extends BatchGetItemRequestProps[],
  OPTIONS extends BatchGetTableItemsOptions,
  ITEMS extends unknown[] = []
> = REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
  ? REQUESTS_HEAD extends BatchGetItemRequestProps
    ? REQUESTS_TAIL extends BatchGetItemRequestProps[]
      ? BatchGetResponseTableItems<
          REQUESTS_TAIL,
          OPTIONS,
          [
            ...ITEMS,
            (
              | FormattedItem<
                  REQUESTS_HEAD[$entity],
                  {
                    attributes: OPTIONS extends {
                      attributes: Paths<REQUESTS_HEAD[$entity]['schema']>[]
                    }
                      ? OPTIONS['attributes'][number]
                      : undefined
                  }
                >
              | undefined
            )
          ]
        >
      : never
    : never
  : ITEMS

export const batchGet = async <
  HEAD_REQUEST_OR_OPTIONS extends BatchGetTableItemsRequest | BatchGetOptions,
  TAIL_REQUESTS extends BatchGetTableItemsRequest[]
>(
  headRequestOrOptions: HEAD_REQUEST_OR_OPTIONS,
  ...tailRequests: TAIL_REQUESTS
): Promise<
  HEAD_REQUEST_OR_OPTIONS extends BatchGetTableItemsRequest
    ? BatchGetResponse<[HEAD_REQUEST_OR_OPTIONS, ...TAIL_REQUESTS]>
    : BatchGetResponse<TAIL_REQUESTS>
> => {
  type RESPONSE = HEAD_REQUEST_OR_OPTIONS extends BatchGetTableItemsRequest
    ? BatchGetResponse<[HEAD_REQUEST_OR_OPTIONS, ...TAIL_REQUESTS]>
    : BatchGetResponse<TAIL_REQUESTS>

  const requests: BatchGetTableItemsRequest[] = tailRequests
  let options: BatchGetOptions = {}

  if (headRequestOrOptions instanceof BatchGetTableItemsRequest) {
    requests.unshift(headRequestOrOptions)
  } else {
    options = headRequestOrOptions
  }

  const firstRequest = requests[0]
  if (firstRequest === undefined) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'batchGet incomplete: No BatchGetTableItemsRequest supplied'
    })
  }

  const documentClient = options.documentClient ?? firstRequest[$table].getDocumentClient()

  const commandInput = getBatchGetCommandInput(requests, options)

  const { Responses: responses, ...rest } = await documentClient.send(
    new BatchGetCommand(commandInput)
  )

  if (responses === undefined) {
    return rest as RESPONSE
  }

  const formattedResponses = requests.map(request => {
    const tableName = request[$table].getName()
    const itemRequests = request[$requests]
    const { attributes } = (request as BatchGetTableItemsRequest)[$options]

    return itemRequests?.map((itemRequest, index) => {
      const entity = itemRequest[$entity]
      const tableResponses = responses[tableName]

      if (tableResponses === undefined) {
        return undefined
      }

      // We know RequestItems & Keys exist
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const itemKey = commandInput.RequestItems![tableName].Keys![index]

      const savedItem = tableResponses.find(tableResponse =>
        Object.entries(itemKey).every(([key, value]) => tableResponse[key] === value)
      )

      if (savedItem === undefined) {
        return undefined
      }

      return entity.build(EntityFormatter).format(savedItem, { attributes })
    })
  })

  return { Responses: formattedResponses, ...rest } as RESPONSE
}

export const getBatchGetCommandInput = (
  requests: BatchGetTableItemsRequest[],
  options: BatchGetOptions = {}
): BatchGetCommandInput => {
  const requestItems: NonNullable<BatchGetCommandInput>['RequestItems'] = {}

  if (requests.length === 0) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'batchGet arguments incomplete: No BatchGetTableItemsRequest supplied'
    })
  }

  for (const request of requests) {
    const tableName = request[$table].getName()

    if (tableName in requestItems) {
      throw new DynamoDBToolboxError('actions.incompleteAction', { message: '' })
    }

    requestItems[tableName] = request.params()
  }

  const { capacity } = options

  return {
    RequestItems: requestItems,
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {})
  }
}
