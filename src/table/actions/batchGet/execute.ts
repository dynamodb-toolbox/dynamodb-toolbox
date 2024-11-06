import { BatchGetCommand as _BatchGetCommand } from '@aws-sdk/lib-dynamodb'
import type {
  BatchGetCommandInput,
  BatchGetCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { Paths } from '~/schema/index.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import { isEmpty } from '~/utils/isEmpty.js'

import { BatchGetCommand } from './batchGetCommand.js'
import type { BatchGetCommandOptions, BatchGetRequestProps } from './batchGetCommand.js'
import { $options, $requests } from './constants.js'

export interface ExecuteBatchGetOptions extends DocumentClientOptions {
  capacity?: CapacityOption
  documentClient?: DynamoDBDocumentClient
  maxAttempts?: number
}

type ExecuteBatchGet = <
  COMMANDS extends BatchGetCommand[] | [ExecuteBatchGetOptions, ...BatchGetCommand[]]
>(
  ..._commands: COMMANDS
) => Promise<
  COMMANDS extends BatchGetCommand[]
    ? ExecuteBatchGetResponse<COMMANDS>
    : COMMANDS extends [unknown, ...infer REQUESTS_TAIL]
      ? REQUESTS_TAIL extends BatchGetCommand[]
        ? ExecuteBatchGetResponse<REQUESTS_TAIL>
        : never
      : never
>

type ExecuteBatchGetResponse<COMMAND extends BatchGetCommand[]> = Omit<
  BatchGetCommandOutput,
  'Responses'
> & { Responses: BatchGetResponses<COMMAND> }

type BatchGetResponses<
  COMMANDS extends BatchGetCommand[],
  RESPONSES extends unknown[] = []
> = COMMANDS extends [infer COMMANDS_HEAD, ...infer COMMANDS_TAILS]
  ? COMMANDS_HEAD extends BatchGetCommand
    ? COMMANDS_TAILS extends BatchGetCommand[]
      ? BatchGetResponses<
          COMMANDS_TAILS,
          [
            ...RESPONSES,
            BatchGetRequestResponses<NonNullable<COMMANDS_HEAD[$requests]>, COMMANDS_HEAD[$options]>
          ]
        >
      : never
    : never
  : number extends COMMANDS['length']
    ? [
        ...RESPONSES,
        ...(COMMANDS[number] extends infer TABLE_COMMAND
          ? TABLE_COMMAND extends BatchGetCommand
            ? BatchGetRequestResponses<
                NonNullable<TABLE_COMMAND[$requests]>,
                TABLE_COMMAND[$options]
              >
            : never
          : never)[]
      ]
    : RESPONSES

type BatchGetRequestResponses<
  REQUESTS extends BatchGetRequestProps[],
  OPTIONS extends BatchGetCommandOptions,
  ITEMS extends unknown[] = []
> = REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
  ? REQUESTS_HEAD extends BatchGetRequestProps
    ? REQUESTS_TAIL extends BatchGetRequestProps[]
      ? BatchGetRequestResponses<
          REQUESTS_TAIL,
          OPTIONS,
          [
            ...ITEMS,
            (
              | FormattedItem<
                  REQUESTS_HEAD['entity'],
                  {
                    attributes: OPTIONS extends {
                      attributes: Paths<REQUESTS_HEAD['entity']['schema']>[]
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
  : number extends REQUESTS['length']
    ? [
        ...ITEMS,
        ...(
          | (REQUESTS[number] extends infer ENTITY_REQUEST
              ? ENTITY_REQUEST extends BatchGetRequestProps
                ? FormattedItem<
                    ENTITY_REQUEST['entity'],
                    {
                      attributes: OPTIONS extends {
                        attributes: Paths<ENTITY_REQUEST['entity']['schema']>[]
                      }
                        ? OPTIONS['attributes'][number]
                        : undefined
                    }
                  >
                : never
              : never)
          | undefined
        )[]
      ]
    : ITEMS

export const execute: ExecuteBatchGet = async <
  COMMANDS extends BatchGetCommand[] | [ExecuteBatchGetOptions, ...BatchGetCommand[]]
>(
  ..._commands: COMMANDS
) => {
  type RESPONSE = COMMANDS extends BatchGetCommand[]
    ? ExecuteBatchGetResponse<COMMANDS>
    : COMMANDS extends [unknown, ...infer REQUESTS_TAIL]
      ? REQUESTS_TAIL extends BatchGetCommand[]
        ? ExecuteBatchGetResponse<REQUESTS_TAIL>
        : never
      : never

  const [headCommandOrOptions = {}, ...tailCommands] = _commands

  const commands = tailCommands as BatchGetCommand[]
  let options: ExecuteBatchGetOptions = {}

  if (headCommandOrOptions instanceof BatchGetCommand) {
    commands.unshift(headCommandOrOptions)
  } else {
    options = headCommandOrOptions
  }

  const firstCommand = commands[0]
  if (firstCommand === undefined) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'batchGet incomplete: No BatchGetCommand supplied'
    })
  }

  const { maxAttempts = 1, documentClient, capacity, ...documentClientOptions } = options
  const docClient = documentClient ?? firstCommand.table.getDocumentClient()

  const { RequestItems: initialRequestItems, ...commandOptions } = getCommandInput(commands, {
    capacity
  })

  let attemptCount = 0
  let requestItems: BatchGetCommandInput['RequestItems'] = initialRequestItems
  let responses: BatchGetCommandOutput['Responses'] = undefined
  let unprocessedKeys: BatchGetCommandOutput['UnprocessedKeys'] = {}
  let consumedCapacity: BatchGetCommandOutput['ConsumedCapacity'] = undefined
  let responseMetadata: BatchGetCommandOutput['$metadata'] = {}

  do {
    attemptCount += 1

    const {
      Responses: attemptResponses,
      UnprocessedKeys: attemptUnprocessedKeys = {},
      ConsumedCapacity: attemptConsumedCapacity,
      $metadata: attemptMetadata
    } = await docClient.send(
      new _BatchGetCommand({ RequestItems: requestItems, ...commandOptions }),
      documentClientOptions
    )

    if (attemptResponses !== undefined) {
      if (responses === undefined) {
        responses = {}
      }

      for (const [tableName, attemptTableResponses] of Object.entries(attemptResponses)) {
        const tableResponses = responses[tableName]
        if (tableResponses === undefined) {
          responses[tableName] = attemptTableResponses
        } else {
          tableResponses.push(...attemptTableResponses)
        }
      }
    }

    requestItems = attemptUnprocessedKeys
    unprocessedKeys = attemptUnprocessedKeys
    consumedCapacity = attemptConsumedCapacity
    responseMetadata = attemptMetadata
  } while (attemptCount < maxAttempts && !isEmpty(unprocessedKeys))

  let formattedResponses: ((FormattedItem | undefined)[] | undefined)[] | undefined = undefined

  if (responses !== undefined) {
    formattedResponses = commands.map(command => {
      const tableName = command.table.getName()
      const requests = command[$requests]
      const { attributes } = (command as BatchGetCommand)[$options]

      return requests?.map((request, index) => {
        const entity = request.entity
        // We know responses is defined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tableResponses = responses![tableName]

        if (tableResponses === undefined) {
          return undefined
        }

        // We know RequestItems & Keys exist
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const itemKey = initialRequestItems![tableName]!.Keys![index]!

        const savedItem = tableResponses.find(tableResponse =>
          Object.entries(itemKey).every(([key, value]) => tableResponse[key] === value)
        )

        if (savedItem === undefined) {
          return undefined
        }

        return entity.build(EntityFormatter).format(savedItem, { attributes })
      })
    })
  }

  return {
    ...(formattedResponses !== undefined ? { Responses: formattedResponses } : {}),
    ...(unprocessedKeys !== undefined ? { UnprocessedKeys: unprocessedKeys } : {}),
    // return ConsumedCapacity & $metadata only if one attempt has been tried
    ...(attemptCount === 1
      ? {
          ...(consumedCapacity !== undefined ? { ConsumedCapacity: consumedCapacity } : {}),
          ...(responseMetadata !== undefined ? { $metadata: responseMetadata } : {})
        }
      : {})
  } as RESPONSE
}

export const getCommandInput = (
  commands: BatchGetCommand[],
  options: ExecuteBatchGetOptions = {}
): BatchGetCommandInput => {
  const requestItems: NonNullable<BatchGetCommandInput>['RequestItems'] = {}

  if (commands.length === 0) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'Unable to execute BatchGetCommands: No BatchGetCommand supplied'
    })
  }

  for (const command of commands) {
    const commandParams = command.params()

    for (const tableName of Object.keys(commandParams)) {
      if (tableName in requestItems) {
        throw new DynamoDBToolboxError('actions.invalidAction', {
          message: `Two BatchGetCommands detected for table: ${tableName}. Please provide only one BatchGetCommand per table`
        })
      }
    }

    Object.assign(requestItems, commandParams)
  }

  const { capacity } = options

  return {
    RequestItems: requestItems,
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {})
  }
}
