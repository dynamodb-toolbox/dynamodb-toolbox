import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import {
  UpdateItemCommand,
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from 'v1/operations/updateItem'
import { updateItemParams } from 'v1/operations/updateItem/updateItemParams'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $operationName,
  $entity,
  $mockedEntity,
  $mockedImplementations,
  $receivedCommands
} from './constants'

export class UpdateItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
> implements UpdateItemCommand<ENTITY, OPTIONS> {
  static operationType = 'entity' as const
  static operationName = 'update' as const
  static [$operationName] = 'update' as const

  _entity: ENTITY;
  [$mockedEntity]: MockedEntity<ENTITY>
  _item?: UpdateItemInput<ENTITY>
  item: (nextItem: UpdateItemInput<ENTITY>) => UpdateItemCommandMock<ENTITY, OPTIONS>
  _options: OPTIONS
  options: <NEXT_OPTIONS extends UpdateItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => UpdateItemCommandMock<ENTITY, NEXT_OPTIONS>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    item?: UpdateItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this._entity = mockedEntity[$entity]
    this[$mockedEntity] = mockedEntity
    this._item = item
    this._options = options

    this.item = nextItem => new UpdateItemCommandMock(this[$mockedEntity], nextItem, this._options)
    this.options = nextOptions =>
      new UpdateItemCommandMock(this[$mockedEntity], this._item, nextOptions)
  }

  params = (): UpdateCommandInput => {
    if (!this._item) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'UpdateItemCommand incomplete: Missing "item" property'
      })
    }

    return updateItemParams(this._entity, this._item, this._options)
  }

  send = async (): Promise<UpdateItemResponse<ENTITY, OPTIONS>> => {
    this[$mockedEntity][$receivedCommands].update.push([this._item, this._options])

    const implementation = this[$mockedEntity][$mockedImplementations].update

    if (implementation !== undefined) {
      if (!this._item) {
        throw new DynamoDBToolboxError('commands.incompleteCommand', {
          message: 'UpdateItemCommand incomplete: Missing "item" property'
        })
      }

      return (implementation(this._item, this._options) as unknown) as UpdateItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new UpdateItemCommand(this._entity, this._item, this._options).send()
  }
}
