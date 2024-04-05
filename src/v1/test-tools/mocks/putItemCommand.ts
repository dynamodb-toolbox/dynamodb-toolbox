import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, $entity } from 'v1/entity'
import {
  PutItemCommand,
  PutItemInput,
  PutItemOptions,
  PutItemResponse
} from 'v1/entity/actions/commands/putItem'
import { putItemParams } from 'v1/entity/actions/commands/putItem/putItemParams'
import { $item, $options } from 'v1/entity/actions/commands/putItem/putItemCommand'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $operationName,
  $originalEntity,
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
  static [$operationName] = 'put' as const;

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
    this[$mockedEntity][$receivedCommands].put.push([this[$item], this[$options]])

    const implementation = this[$mockedEntity][$mockedImplementations].put

    if (implementation !== undefined) {
      if (!this[$item]) {
        throw new DynamoDBToolboxError('actions.incompleteAction', {
          message: 'PutItemCommand incomplete: Missing "item" property'
        })
      }

      return (implementation(this[$item], this[$options]) as unknown) as PutItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new PutItemCommand(this[$entity], this[$item], this[$options]).send()
  }
}
