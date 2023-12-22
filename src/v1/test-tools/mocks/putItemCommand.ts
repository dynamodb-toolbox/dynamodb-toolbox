import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import {
  PutItemCommand,
  PutItemInput,
  PutItemOptions,
  PutItemResponse
} from 'v1/operations/putItem'
import { putItemParams } from 'v1/operations/putItem/putItemParams'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $operationName,
  $entity,
  $mockedEntity,
  $mockedImplementations,
  $receivedCommands
} from './constants'

export class PutItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> implements PutItemCommand<ENTITY, OPTIONS> {
  static operationType = 'entity' as const
  static operationName = 'put' as const
  static [$operationName] = 'put' as const

  _entity: ENTITY;
  [$mockedEntity]: MockedEntity<ENTITY>
  _item?: PutItemInput<ENTITY>
  item: (nextItem: PutItemInput<ENTITY>) => PutItemCommandMock<ENTITY, OPTIONS>
  _options: OPTIONS
  options: <NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => PutItemCommandMock<ENTITY, NEXT_OPTIONS>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    item?: PutItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this._entity = mockedEntity[$entity]
    this[$mockedEntity] = mockedEntity
    this._item = item
    this._options = options

    this.item = nextItem => new PutItemCommandMock(this[$mockedEntity], nextItem, this._options)
    this.options = nextOptions =>
      new PutItemCommandMock(this[$mockedEntity], this._item, nextOptions)
  }

  params = (): PutCommandInput => {
    if (!this._item) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this._entity, this._item, this._options)
  }

  send = async (): Promise<PutItemResponse<ENTITY, OPTIONS>> => {
    this[$mockedEntity][$receivedCommands].put.push([this._item, this._options])

    const implementation = this[$mockedEntity][$mockedImplementations].put

    if (implementation !== undefined) {
      if (!this._item) {
        throw new DynamoDBToolboxError('commands.incompleteCommand', {
          message: 'PutItemCommand incomplete: Missing "item" property'
        })
      }

      return (implementation(this._item, this._options) as unknown) as PutItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new PutItemCommand(this._entity, this._item, this._options).send()
  }
}
