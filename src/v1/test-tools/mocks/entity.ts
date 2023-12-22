import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/commands'
import { GetItemCommand, GetItemOptions, GetItemResponse } from 'v1/commands/getItem'
import type { GetItemCommandClass } from 'v1/commands/getItem/command'
import { PutItemCommand, PutItemInput, PutItemOptions, PutItemResponse } from 'v1/commands/putItem'
import type { PutItemCommandClass } from 'v1/commands/putItem/command'
import { DeleteItemCommand, DeleteItemOptions, DeleteItemResponse } from 'v1/commands/deleteItem'
import type { DeleteItemCommandClass } from 'v1/commands/deleteItem/command'
import {
  UpdateItemCommand,
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from 'v1/commands/updateItem'
import type { UpdateItemCommandClass } from 'v1/commands/updateItem/command'

import type { CommandClassMocker, CommandClassResults, operationName } from './types'
import { GetItemCommandMock } from './getItemCommand'
import { PutItemCommandMock } from './putItemCommand'
import { DeleteItemCommandMock } from './deleteItemCommand'
import { UpdateItemCommandMock } from './updateItemCommand'
import { CommandMocker } from './commandMocker'
import { CommandResults } from './commandResults'
import { $entity, $mockedImplementations, $receivedCommands } from './constants'

export class MockedEntity<ENTITY extends EntityV2 = EntityV2> {
  [$entity]: ENTITY;

  [$mockedImplementations]: Partial<{
    get: (input: KeyInput<ENTITY>, options?: GetItemOptions<ENTITY>) => GetItemResponse<ENTITY>
    put: (input: PutItemInput<ENTITY>, options?: PutItemOptions<ENTITY>) => PutItemResponse<ENTITY>
    delete: (
      input: KeyInput<ENTITY>,
      options?: DeleteItemOptions<ENTITY>
    ) => DeleteItemResponse<ENTITY>
    update: (
      input: UpdateItemInput<ENTITY>,
      options?: UpdateItemOptions<ENTITY>
    ) => UpdateItemResponse<ENTITY>
  }>;
  [$receivedCommands]: {
    get: [input?: KeyInput<ENTITY>, options?: GetItemOptions<ENTITY>][]
    put: [input?: PutItemInput<ENTITY>, options?: PutItemOptions<ENTITY>][]
    delete: [input?: KeyInput<ENTITY>, options?: DeleteItemOptions<ENTITY>][]
    update: [input?: UpdateItemInput<ENTITY>, options?: UpdateItemOptions<ENTITY>][]
  }
  reset: () => void

  constructor(entity: ENTITY) {
    this[$entity] = entity

    this[$mockedImplementations] = {}
    this[$receivedCommands] = { get: [], put: [], delete: [], update: [] }

    this.reset = () => {
      this[$mockedImplementations] = {}
      this[$receivedCommands] = { get: [], put: [], delete: [], update: [] }
    }

    entity.build = command => {
      switch (command) {
        // @ts-expect-error impossible to fix
        case GetItemCommand:
          return new GetItemCommandMock(this) as any
        // @ts-expect-error impossible to fix
        case PutItemCommand:
          return new PutItemCommandMock(this) as any
        // @ts-expect-error impossible to fix
        case DeleteItemCommand:
          return new DeleteItemCommandMock(this) as any
        // @ts-expect-error impossible to fix
        case UpdateItemCommand:
          return new UpdateItemCommandMock(this) as any
        default:
          throw new Error(`Unable to mock entity command: ${String(command)}`)
      }
    }
  }

  on = <
    COMMAND_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(
    command: COMMAND_CLASS
  ): CommandClassMocker<ENTITY, COMMAND_CLASS> =>
    new CommandMocker<operationName, any, any, any>(
      command.operationName,
      this
    ) as CommandClassMocker<ENTITY, COMMAND_CLASS>

  received = <
    COMMAND_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(
    command: COMMAND_CLASS
  ): CommandClassResults<ENTITY, COMMAND_CLASS> =>
    new CommandResults<unknown, unknown>(
      this[$receivedCommands][command.operationName]
    ) as CommandClassResults<ENTITY, COMMAND_CLASS>
}
