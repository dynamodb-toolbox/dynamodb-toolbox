import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { DeleteItemCommand, DeleteItemOptions, DeleteItemResponse } from 'v1/operations/deleteItem'
import { deleteItemParams } from 'v1/operations/deleteItem/deleteItemParams'
import type { KeyInput } from 'v1/operations/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $operationName,
  $entity,
  $mockedEntity,
  $mockedImplementations,
  $receivedCommands
} from './constants'

export class DeleteItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
> implements DeleteItemCommand<ENTITY, OPTIONS> {
  static operationType = 'entity' as const
  static operationName = 'delete' as const
  static [$operationName] = 'delete' as const

  _entity: ENTITY;
  [$mockedEntity]: MockedEntity<ENTITY>
  _key?: KeyInput<ENTITY>
  key: (nextKey: KeyInput<ENTITY>) => DeleteItemCommandMock<ENTITY, OPTIONS>
  _options: OPTIONS
  options: <NEXT_OPTIONS extends DeleteItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => DeleteItemCommandMock<ENTITY, NEXT_OPTIONS>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    key?: KeyInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this._entity = mockedEntity[$entity]
    this[$mockedEntity] = mockedEntity
    this._key = key
    this._options = options

    this.key = nextKey => new DeleteItemCommandMock(this[$mockedEntity], nextKey, this._options)
    this.options = nextOptions =>
      new DeleteItemCommandMock(this[$mockedEntity], this._key, nextOptions)
  }

  params = (): DeleteCommandInput => {
    if (!this._key) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    return deleteItemParams(this._entity, this._key, this._options)
  }

  send = async (): Promise<DeleteItemResponse<ENTITY, OPTIONS>> => {
    this[$mockedEntity][$receivedCommands].delete.push([this._key, this._options])

    const implementation = this[$mockedEntity][$mockedImplementations].delete

    if (implementation !== undefined) {
      if (!this._key) {
        throw new DynamoDBToolboxError('commands.incompleteCommand', {
          message: 'DeleteItemCommand incomplete: Missing "key" property'
        })
      }

      return (implementation(this._key, this._options) as unknown) as DeleteItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new DeleteItemCommand(this._entity, this._key, this._options).send()
  }
}
