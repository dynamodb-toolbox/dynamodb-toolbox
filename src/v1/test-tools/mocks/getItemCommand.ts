import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { GetItemCommand, GetItemOptions, GetItemResponse } from 'v1/operations/getItem'
import { $key, $options } from 'v1/operations/getItem/command'
import { getItemParams } from 'v1/operations/getItem/getItemParams'
import type { KeyInput } from 'v1/operations/types'
import { $entity } from 'v1/operations/class'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $operationName,
  $originalEntity,
  $mockedEntity,
  $mockedImplementations,
  $receivedCommands
} from './constants'

export class GetItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> implements GetItemCommand<ENTITY, OPTIONS> {
  static operationType = 'entity' as const
  static operationName = 'get' as const
  static [$operationName] = 'get' as const;

  [$entity]: ENTITY;
  [$key]?: KeyInput<ENTITY>
  key: (nextKey: KeyInput<ENTITY>) => GetItemCommandMock<ENTITY, OPTIONS>;
  [$options]: OPTIONS
  options: <NEXT_OPTIONS extends GetItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => GetItemCommandMock<ENTITY, NEXT_OPTIONS>;

  [$mockedEntity]: MockedEntity<ENTITY>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    key?: KeyInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this[$entity] = mockedEntity[$originalEntity]
    this[$mockedEntity] = mockedEntity
    this[$key] = key
    this[$options] = options

    this.key = nextKey => new GetItemCommandMock(this[$mockedEntity], nextKey, this[$options])
    this.options = nextOptions =>
      new GetItemCommandMock(this[$mockedEntity], this[$key], nextOptions)
  }

  params = (): GetCommandInput => {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }

    return getItemParams(this[$entity], this[$key], this[$options])
  }

  send = async (): Promise<GetItemResponse<ENTITY, OPTIONS>> => {
    this[$mockedEntity][$receivedCommands].get.push([this[$key], this[$options]])

    const implementation = this[$mockedEntity][$mockedImplementations].get

    if (implementation !== undefined) {
      if (!this[$key]) {
        throw new DynamoDBToolboxError('operations.incompleteCommand', {
          message: 'GetItemCommand incomplete: Missing "key" property'
        })
      }

      return implementation(this[$key], this[$options])
    }

    return new GetItemCommand(this[$entity], this[$key], this[$options]).send()
  }
}
