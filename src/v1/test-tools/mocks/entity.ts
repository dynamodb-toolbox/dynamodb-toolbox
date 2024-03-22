import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/operations/types/KeyInput'
import { GetItemCommand, GetItemOptions, GetItemResponse } from 'v1/operations/getItem'
import type { GetItemCommandClass } from 'v1/operations/getItem/command'
import {
  PutItemCommand,
  PutItemInput,
  PutItemOptions,
  PutItemResponse
} from 'v1/operations/putItem'
import type { PutItemCommandClass } from 'v1/operations/putItem/command'
import { DeleteItemCommand, DeleteItemOptions, DeleteItemResponse } from 'v1/operations/deleteItem'
import type { DeleteItemCommandClass } from 'v1/operations/deleteItem/command'
import {
  UpdateItemCommand,
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from 'v1/operations/updateItem'
import type { UpdateItemCommandClass } from 'v1/operations/updateItem/command'

import type { OperationClassMocker, OperationClassResults, OperationName } from './types'
import { GetItemCommandMock } from './getItemCommand'
import { PutItemCommandMock } from './putItemCommand'
import { DeleteItemCommandMock } from './deleteItemCommand'
import { UpdateItemCommandMock } from './updateItemCommand'
import { OperationMocker } from './commandMocker'
import { CommandResults } from './commandResults'
import { $originalEntity, $mockedImplementations, $receivedCommands } from './constants'

export class MockedEntity<ENTITY extends EntityV2 = EntityV2> {
  [$originalEntity]: ENTITY;

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

  constructor(entity: ENTITY) {
    this[$originalEntity] = entity

    this[$mockedImplementations] = {}
    this[$receivedCommands] = { get: [], put: [], delete: [], update: [] }

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

  reset(): void {
    this[$mockedImplementations] = {}
    this[$receivedCommands] = { get: [], put: [], delete: [], update: [] }
  }

  on<
    OPERATION_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(operation: OPERATION_CLASS): OperationClassMocker<ENTITY, OPERATION_CLASS> {
    return new OperationMocker<OperationName, any, any, any>(
      operation.operationName,
      this
    ) as OperationClassMocker<ENTITY, OPERATION_CLASS>
  }

  received<
    OPERATION_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(operation: OPERATION_CLASS): OperationClassResults<ENTITY, OPERATION_CLASS> {
    return new CommandResults<unknown, unknown>(
      this[$receivedCommands][operation.operationName]
    ) as OperationClassResults<ENTITY, OPERATION_CLASS>
  }
}
