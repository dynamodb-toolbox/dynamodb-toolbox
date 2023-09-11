import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { PutItemCommand, PutItemInput, PutItemOptions, PutItemResponse } from 'v1/commands/putItem'
import { putItemParams } from 'v1/commands/putItem/putItemParams'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'

export class PutItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> implements PutItemCommand<ENTITY, OPTIONS> {
  static commandType = 'put' as const

  public entity: ENTITY
  public mockedEntity: MockedEntity<ENTITY>
  _item?: PutItemInput<ENTITY, false>
  item: (nextItem: PutItemInput<ENTITY, false>) => PutItemCommandMock<ENTITY, OPTIONS>
  _options: OPTIONS
  options: <NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => PutItemCommandMock<ENTITY, NEXT_OPTIONS>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    item?: PutItemInput<ENTITY, false>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this.entity = mockedEntity.entity
    this.mockedEntity = mockedEntity
    this._item = item
    this._options = options

    this.item = nextItem => new PutItemCommandMock(this.mockedEntity, nextItem, this._options)
    this.options = nextOptions => new PutItemCommandMock(this.mockedEntity, this._item, nextOptions)
  }

  params = (): PutCommandInput => {
    if (!this._item) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }
    const params = putItemParams(this.entity, this._item, this._options)

    return params
  }

  send = async (): Promise<PutItemResponse<ENTITY, OPTIONS>> => {
    this.mockedEntity._receivedCommands.put.push([this._item, this._options])

    const implementation = this.mockedEntity._mockedImplementations.put

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

    return new PutItemCommand(this.entity, this._item, this._options).send()
  }
}
