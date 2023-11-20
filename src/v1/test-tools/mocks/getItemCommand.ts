import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { GetItemCommand, GetItemOptions, GetItemResponse } from 'v1/commands/getItem'
import { getItemParams } from 'v1/commands/getItem/getItemParams'
import type { KeyInput } from 'v1/commands/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $commandName,
  $entity,
  $mockedEntity,
  $mockedImplementations,
  $receivedCommands
} from './constants'

export class GetItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> implements GetItemCommand<ENTITY, OPTIONS> {
  static commandType = 'entity' as const
  static commandName = 'get' as const
  static [$commandName] = 'get' as const

  _entity: ENTITY;
  [$mockedEntity]: MockedEntity<ENTITY>
  _key?: KeyInput<ENTITY>
  key: (nextKey: KeyInput<ENTITY>) => GetItemCommandMock<ENTITY, OPTIONS>
  _options: OPTIONS
  options: <NEXT_OPTIONS extends GetItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => GetItemCommandMock<ENTITY, NEXT_OPTIONS>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    key?: KeyInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this._entity = mockedEntity[$entity]
    this[$mockedEntity] = mockedEntity
    this._key = key
    this._options = options

    this.key = nextKey => new GetItemCommandMock(this[$mockedEntity], nextKey, this._options)
    this.options = nextOptions =>
      new GetItemCommandMock(this[$mockedEntity], this._key, nextOptions)
  }

  params = (): GetCommandInput => {
    if (!this._key) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }

    return getItemParams(this._entity, this._key, this._options)
  }

  send = async (): Promise<GetItemResponse<ENTITY, OPTIONS>> => {
    this[$mockedEntity][$receivedCommands].get.push([this._key, this._options])

    const implementation = this[$mockedEntity][$mockedImplementations].get

    if (implementation !== undefined) {
      if (!this._key) {
        throw new DynamoDBToolboxError('commands.incompleteCommand', {
          message: 'GetItemCommand incomplete: Missing "key" property'
        })
      }

      return implementation(this._key, this._options)
    }

    return new GetItemCommand(this._entity, this._key, this._options).send()
  }
}
