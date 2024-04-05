import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, $entity } from 'v1/entity'
import { GetItemCommand, GetItemOptions, GetItemResponse } from 'v1/entity/actions/commands/getItem'
import { $key, $options } from 'v1/entity/actions/commands/getItem/getItemCommand'
import { getItemParams } from 'v1/entity/actions/commands/getItem/getItemParams'
import type { KeyInput } from 'v1/entity/actions/tParse'
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
  static operationName = 'get' as const
  static [$operationName] = 'get' as const;

  [$entity]: ENTITY;
  [$key]?: KeyInput<ENTITY>;
  [$options]: OPTIONS;
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
  }

  key(nextKey: KeyInput<ENTITY>): GetItemCommandMock<ENTITY, OPTIONS> {
    return new GetItemCommandMock(this[$mockedEntity], nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends GetItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): GetItemCommandMock<ENTITY, NEXT_OPTIONS> {
    return new GetItemCommandMock(this[$mockedEntity], this[$key], nextOptions)
  }

  params(): GetCommandInput {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }

    return getItemParams(this[$entity], this[$key], this[$options])
  }

  async send(): Promise<GetItemResponse<ENTITY, OPTIONS>> {
    this[$mockedEntity][$receivedCommands].get.push([this[$key], this[$options]])

    const implementation = this[$mockedEntity][$mockedImplementations].get

    if (implementation !== undefined) {
      if (!this[$key]) {
        throw new DynamoDBToolboxError('actions.incompleteAction', {
          message: 'GetItemCommand incomplete: Missing "key" property'
        })
      }

      return implementation(this[$key], this[$options]) as any
    }

    return new GetItemCommand(this[$entity], this[$key], this[$options]).send()
  }
}
