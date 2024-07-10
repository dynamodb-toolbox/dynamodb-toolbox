import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { $item, $options } from '~/entity/actions/put/constants.js'
import { PutItemCommand } from '~/entity/actions/put/index.js'
import type { PutItemInput, PutItemOptions, PutItemResponse } from '~/entity/actions/put/index.js'
import { putItemParams } from '~/entity/actions/put/putItemParams/index.js'
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

export class PutItemCommandMock<
  ENTITY extends Entity = Entity,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> implements PutItemCommand<ENTITY, OPTIONS>
{
  static actionName = 'put' as const
  static [$actionName] = 'put' as const;

  [$entity]: ENTITY;
  [$item]?: PutItemInput<ENTITY>;
  [$options]: OPTIONS;
  [$mockedEntity]: MockedEntity<ENTITY>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    item?: PutItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this[$entity] = mockedEntity[$originalEntity]
    this[$mockedEntity] = mockedEntity
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: PutItemInput<ENTITY>): PutItemCommandMock<ENTITY, OPTIONS> {
    return new PutItemCommandMock(this[$mockedEntity], nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): PutItemCommandMock<ENTITY, NEXT_OPTIONS> {
    return new PutItemCommandMock(this[$mockedEntity], this[$item], nextOptions)
  }

  params(): PutCommandInput {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this[$entity], this[$item], this[$options])
  }

  async send(): Promise<PutItemResponse<ENTITY, OPTIONS>> {
    this[$mockedEntity][$receivedActions].put.push([this[$item], this[$options]])

    const implementation = this[$mockedEntity][$mockedImplementations].put

    if (implementation !== undefined) {
      if (!this[$item]) {
        throw new DynamoDBToolboxError('actions.incompleteAction', {
          message: 'PutItemCommand incomplete: Missing "item" property'
        })
      }

      return implementation(this[$item], this[$options]) as unknown as PutItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new PutItemCommand(this[$entity], this[$item], this[$options]).send()
  }
}
