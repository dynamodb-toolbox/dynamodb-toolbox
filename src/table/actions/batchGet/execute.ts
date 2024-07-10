import { BatchGetCommand as _BatchGetCommand } from '@aws-sdk/lib-dynamodb'
import type {
  BatchGetCommandInput,
  BatchGetCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/actions/format/index.js'
import { $entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import { $table } from '~/table/index.js'

import { BatchGetCommand } from './batchGetCommand.js'
import type { BatchGetCommandOptions, BatchGetRequestProps } from './batchGetCommand.js'
import { $options, $requests } from './constants.js'

export interface ExecuteBatchGetOptions {
  capacity?: CapacityOption
  documentClient?: DynamoDBDocumentClient
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
> = number extends COMMANDS['length']
  ? (COMMANDS[number] extends infer TABLE_COMMAND
      ? TABLE_COMMAND extends BatchGetCommand
        ? BatchGetRequestResponses<NonNullable<TABLE_COMMAND[$requests]>, TABLE_COMMAND[$options]>
        : never
      : never)[]
  : COMMANDS extends [infer COMMANDS_HEAD, ...infer COMMANDS_TAILS]
    ? COMMANDS_HEAD extends BatchGetCommand
      ? COMMANDS_TAILS extends BatchGetCommand[]
        ? BatchGetResponses<
            COMMANDS_TAILS,
            [
              ...RESPONSES,
              BatchGetRequestResponses<
                NonNullable<COMMANDS_HEAD[$requests]>,
                COMMANDS_HEAD[$options]
              >
            ]
          >
        : never
      : never
    : RESPONSES

type BatchGetRequestResponses<
  REQUESTS extends BatchGetRequestProps[],
  OPTIONS extends BatchGetCommandOptions,
  ITEMS extends unknown[] = []
> = number extends REQUESTS['length']
  ? (
      | (REQUESTS[number] extends infer ENTITY_REQUEST
          ? ENTITY_REQUEST extends BatchGetRequestProps
            ? FormattedItem<
                ENTITY_REQUEST[$entity],
                {
                  attributes: OPTIONS extends {
                    attributes: Paths<ENTITY_REQUEST[$entity]['schema']>[]
                  }
                    ? OPTIONS['attributes'][number]
                    : undefined
                }
              >
            : never
          : never)
      | undefined
    )[]
  : REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
    ? REQUESTS_HEAD extends BatchGetRequestProps
      ? REQUESTS_TAIL extends BatchGetRequestProps[]
        ? BatchGetRequestResponses<
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

  const documentClient = options.documentClient ?? firstCommand[$table].getDocumentClient()

  const commandInput = getCommandInput(commands, options)

  const { Responses: responses, ...rest } = await documentClient.send(
    new _BatchGetCommand(commandInput)
  )

  if (responses === undefined) {
    return rest as RESPONSE
  }

  const formattedResponses = commands.map(command => {
    const tableName = command[$table].getName()
    const requests = command[$requests]
    const { attributes } = (command as BatchGetCommand)[$options]

    return requests?.map((request, index) => {
      const entity = request[$entity]
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
    const tableName = command[$table].getName()

    if (tableName in requestItems) {
      throw new DynamoDBToolboxError('actions.invalidAction', {
        message: `Two BatchGetCommands detected for table: ${tableName}. Please provide only one BatchGetCommand per table`
      })
    }

    requestItems[tableName] = command.params()
  }

  const { capacity } = options

  return {
    RequestItems: requestItems,
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {})
  }
}
