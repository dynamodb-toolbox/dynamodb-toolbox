import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/operations'
import type { GetItemOptions, GetItemResponse } from 'v1/operations/getItem'
import type { GetItemCommandClass } from 'v1/operations/getItem/command'
import type { PutItemInput, PutItemOptions, PutItemResponse } from 'v1/operations/putItem'
import type { PutItemCommandClass } from 'v1/operations/putItem/command'
import type { DeleteItemOptions, DeleteItemResponse } from 'v1/operations/deleteItem'
import type { DeleteItemCommandClass } from 'v1/operations/deleteItem/command'
import type {
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from 'v1/operations/updateItem'
import type { UpdateItemCommandClass } from 'v1/operations/updateItem/command'

import type { GetItemCommandMock } from './getItemCommand'
import type { PutItemCommandMock } from './putItemCommand'
import type { DeleteItemCommandMock } from './deleteItemCommand'
import type { UpdateItemCommandMock } from './updateItemCommand'
import type { $operationName } from './constants'
import type { CommandResults } from './commandResults'
import type { CommandMocker } from './commandMocker'

type ClassStaticProperties<CLASSES> = CLASSES extends infer CLASS
  ? {
      [KEY in keyof CLASS as KEY extends 'prototype'
        ? never
        : CLASS[KEY] extends (...args: unknown[]) => unknown
        ? never
        : KEY]: CLASS[KEY]
    }
  : never

type CommandMock =
  | typeof GetItemCommandMock
  | typeof PutItemCommandMock
  | typeof DeleteItemCommandMock
  | typeof UpdateItemCommandMock

export type operationName = ClassStaticProperties<CommandMock>[$operationName]

export type CommandClassResults<
  ENTITY extends EntityV2,
  COMMAND_CLASS extends
    | GetItemCommandClass
    | PutItemCommandClass
    | DeleteItemCommandClass
    | UpdateItemCommandClass
> = COMMAND_CLASS extends GetItemCommandClass
  ? CommandResults<KeyInput<ENTITY>, GetItemOptions<ENTITY>>
  : COMMAND_CLASS extends PutItemCommandClass
  ? CommandResults<PutItemInput<ENTITY>, PutItemOptions<ENTITY>>
  : COMMAND_CLASS extends DeleteItemCommandClass
  ? CommandResults<KeyInput<ENTITY>, DeleteItemOptions<ENTITY>>
  : COMMAND_CLASS extends UpdateItemCommandClass
  ? CommandResults<UpdateItemInput<ENTITY>, UpdateItemOptions<ENTITY>>
  : never

export type CommandClassMocker<
  ENTITY extends EntityV2,
  COMMAND_CLASS extends
    | GetItemCommandClass
    | PutItemCommandClass
    | DeleteItemCommandClass
    | UpdateItemCommandClass
> = COMMAND_CLASS extends GetItemCommandClass
  ? CommandMocker<'get', KeyInput<ENTITY>, GetItemOptions<ENTITY>, Partial<GetItemResponse<ENTITY>>>
  : COMMAND_CLASS extends PutItemCommandClass
  ? CommandMocker<
      'put',
      PutItemInput<ENTITY>,
      PutItemOptions<ENTITY>,
      Partial<PutItemResponse<ENTITY>>
    >
  : COMMAND_CLASS extends DeleteItemCommandClass
  ? CommandMocker<
      'delete',
      KeyInput<ENTITY>,
      DeleteItemOptions<ENTITY>,
      Partial<DeleteItemResponse<ENTITY>>
    >
  : COMMAND_CLASS extends UpdateItemCommandClass
  ? CommandMocker<
      'update',
      UpdateItemInput<ENTITY>,
      UpdateItemOptions<ENTITY>,
      Partial<UpdateItemResponse<ENTITY>>
    >
  : never
