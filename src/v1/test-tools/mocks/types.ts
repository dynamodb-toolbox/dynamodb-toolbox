import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/entity/actions/parse'
import type { GetItemOptions, GetItemResponse } from 'v1/entity/actions/commands/getItem'
import type { GetItemCommandClass } from 'v1/entity/actions/commands/getItem/getItemCommand'
import type {
  PutItemInput,
  PutItemOptions,
  PutItemResponse
} from 'v1/entity/actions/commands/putItem'
import type { PutItemCommandClass } from 'v1/entity/actions/commands/putItem/putItemCommand'
import type { DeleteItemOptions, DeleteItemResponse } from 'v1/entity/actions/commands/deleteItem'
import type { DeleteItemCommandClass } from 'v1/entity/actions/commands/deleteItem/deleteItemCommand'
import type {
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from 'v1/entity/actions/commands/updateItem'
import type { UpdateItemCommandClass } from 'v1/entity/actions/commands/updateItem/updateItemCommand'

import type { GetItemCommandMock } from './getItemCommand'
import type { PutItemCommandMock } from './putItemCommand'
import type { DeleteItemCommandMock } from './deleteItemCommand'
import type { UpdateItemCommandMock } from './updateItemCommand'
import type { $actionName } from './constants'
import type { CommandResults } from './commandResults'
import type { ActionMocker } from './actionMocker'

type ClassStaticProperties<CLASSES> = CLASSES extends infer CLASS
  ? {
      [KEY in keyof CLASS as KEY extends 'prototype'
        ? never
        : CLASS[KEY] extends (...args: unknown[]) => unknown
        ? never
        : KEY]: CLASS[KEY]
    }
  : never

type ActionMock =
  | typeof GetItemCommandMock
  | typeof PutItemCommandMock
  | typeof DeleteItemCommandMock
  | typeof UpdateItemCommandMock

export type ActionName = ClassStaticProperties<ActionMock>[$actionName]

export type ActionClassResults<
  ENTITY extends EntityV2,
  ACTION_CLASS extends
    | GetItemCommandClass
    | PutItemCommandClass
    | DeleteItemCommandClass
    | UpdateItemCommandClass
> = ACTION_CLASS extends GetItemCommandClass
  ? CommandResults<KeyInput<ENTITY>, GetItemOptions<ENTITY>>
  : ACTION_CLASS extends PutItemCommandClass
  ? CommandResults<PutItemInput<ENTITY>, PutItemOptions<ENTITY>>
  : ACTION_CLASS extends DeleteItemCommandClass
  ? CommandResults<KeyInput<ENTITY>, DeleteItemOptions<ENTITY>>
  : ACTION_CLASS extends UpdateItemCommandClass
  ? CommandResults<UpdateItemInput<ENTITY>, UpdateItemOptions<ENTITY>>
  : never

export type ActionClassMocker<
  ENTITY extends EntityV2,
  ACTION_CLASS extends
    | GetItemCommandClass
    | PutItemCommandClass
    | DeleteItemCommandClass
    | UpdateItemCommandClass
> = ACTION_CLASS extends GetItemCommandClass
  ? ActionMocker<'get', KeyInput<ENTITY>, GetItemOptions<ENTITY>, Partial<GetItemResponse<ENTITY>>>
  : ACTION_CLASS extends PutItemCommandClass
  ? ActionMocker<
      'put',
      PutItemInput<ENTITY>,
      PutItemOptions<ENTITY>,
      Partial<PutItemResponse<ENTITY>>
    >
  : ACTION_CLASS extends DeleteItemCommandClass
  ? ActionMocker<
      'delete',
      KeyInput<ENTITY>,
      DeleteItemOptions<ENTITY>,
      Partial<DeleteItemResponse<ENTITY>>
    >
  : ACTION_CLASS extends UpdateItemCommandClass
  ? ActionMocker<
      'update',
      UpdateItemInput<ENTITY>,
      UpdateItemOptions<ENTITY>,
      Partial<UpdateItemResponse<ENTITY>>
    >
  : never
