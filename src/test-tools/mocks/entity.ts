import type { DeleteItemCommandClass } from '~/entity/actions/delete/deleteItemCommand.js'
import { DeleteItemCommand } from '~/entity/actions/delete/index.js'
import type { DeleteItemOptions, DeleteItemResponse } from '~/entity/actions/delete/index.js'
import type { GetItemCommandClass } from '~/entity/actions/get/getItemCommand.js'
import { GetItemCommand } from '~/entity/actions/get/index.js'
import type { GetItemOptions, GetItemResponse } from '~/entity/actions/get/index.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import { PutItemCommand } from '~/entity/actions/put/index.js'
import type { PutItemInput, PutItemOptions, PutItemResponse } from '~/entity/actions/put/index.js'
import type { PutItemCommandClass } from '~/entity/actions/put/putItemCommand.js'
import { UpdateItemCommand } from '~/entity/actions/update/index.js'
import type {
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from '~/entity/actions/update/index.js'
import type { UpdateItemCommandClass } from '~/entity/actions/update/updateItemCommand.js'
import type { Entity } from '~/entity/index.js'

import { ActionMocker } from './actionMocker.js'
import { CommandResults } from './commandResults.js'
import { $mockedImplementations, $originalEntity, $receivedActions } from './constants.js'
import { DeleteItemCommandMock } from './deleteItemCommand.js'
import { GetItemCommandMock } from './getItemCommand.js'
import { PutItemCommandMock } from './putItemCommand.js'
import type { ActionClassMocker, ActionClassResults, ActionName } from './types.js'
import { UpdateItemCommandMock } from './updateItemCommand.js'

export class MockedEntity<ENTITY extends Entity = Entity> {
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
  [$receivedActions]: {
    get: [input?: KeyInput<ENTITY>, options?: GetItemOptions<ENTITY>][]
    put: [input?: PutItemInput<ENTITY>, options?: PutItemOptions<ENTITY>][]
    delete: [input?: KeyInput<ENTITY>, options?: DeleteItemOptions<ENTITY>][]
    update: [input?: UpdateItemInput<ENTITY>, options?: UpdateItemOptions<ENTITY>][]
  }

  constructor(entity: ENTITY) {
    this[$originalEntity] = entity

    this[$mockedImplementations] = {}
    this[$receivedActions] = { get: [], put: [], delete: [], update: [] }

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
    this[$receivedActions] = { get: [], put: [], delete: [], update: [] }
  }

  on<
    ACTION_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(actionClass: ACTION_CLASS): ActionClassMocker<ENTITY, ACTION_CLASS> {
    return new ActionMocker<ActionName, any, any, any>(
      actionClass.actionName,
      this
    ) as ActionClassMocker<ENTITY, ACTION_CLASS>
  }

  received<
    ACTION_CLASS extends
      | GetItemCommandClass
      | PutItemCommandClass
      | DeleteItemCommandClass
      | UpdateItemCommandClass
  >(actionClass: ACTION_CLASS): ActionClassResults<ENTITY, ACTION_CLASS> {
    return new CommandResults<unknown, unknown>(
      this[$receivedActions][actionClass.actionName]
    ) as ActionClassResults<ENTITY, ACTION_CLASS>
  }
}
