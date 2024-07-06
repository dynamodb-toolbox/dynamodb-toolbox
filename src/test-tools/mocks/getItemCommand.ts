import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { $key, $options } from '~/entity/actions/get/getItemCommand.js'
import { getItemParams } from '~/entity/actions/get/getItemParams/index.js'
import { GetItemCommand } from '~/entity/actions/get/index.js'
import type { GetItemOptions, GetItemResponse } from '~/entity/actions/get/index.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import { $entity } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import {
  $actionName,
  $mockedEntity,
  $mockedImplementations,
  $originalEntity,
  $receivedActions
} from './constants.js'
import type { MockedEntity } from './entity.js'

export class GetItemCommandMock<
  ENTITY extends Entity = Entity,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> implements GetItemCommand<ENTITY, OPTIONS>
{
  static actionName = 'get' as const
  static [$actionName] = 'get' as const;

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
    this[$mockedEntity][$receivedActions].get.push([this[$key], this[$options]])

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
