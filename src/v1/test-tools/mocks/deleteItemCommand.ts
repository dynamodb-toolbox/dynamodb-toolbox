import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, $entity } from 'v1/entity'
import {
  DeleteItemCommand,
  DeleteItemOptions,
  DeleteItemResponse
} from 'v1/entity/actions/commands/deleteItem'
import { $key, $options } from 'v1/entity/actions/commands/deleteItem/deleteItemCommand'
import { deleteItemParams } from 'v1/entity/actions/commands/deleteItem/deleteItemParams'
import type { KeyInput } from 'v1/entity/actions/parse'
import { DynamoDBToolboxError } from 'v1/errors'

import type { MockedEntity } from './entity'
import {
  $actionName,
  $originalEntity,
  $mockedEntity,
  $mockedImplementations,
  $receivedActions
} from './constants'

export class DeleteItemCommandMock<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
> implements DeleteItemCommand<ENTITY, OPTIONS> {
  static actionName = 'delete' as const
  static [$actionName] = 'delete' as const;

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

  key(nextKey: KeyInput<ENTITY>): DeleteItemCommandMock<ENTITY, OPTIONS> {
    return new DeleteItemCommandMock(this[$mockedEntity], nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends DeleteItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): DeleteItemCommandMock<ENTITY, NEXT_OPTIONS> {
    return new DeleteItemCommandMock(this[$mockedEntity], this[$key], nextOptions)
  }

  params(): DeleteCommandInput {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    return deleteItemParams(this[$entity], this[$key], this[$options])
  }

  async send(): Promise<DeleteItemResponse<ENTITY, OPTIONS>> {
    this[$mockedEntity][$receivedActions].delete.push([this[$key], this[$options]])

    const implementation = this[$mockedEntity][$mockedImplementations].delete

    if (implementation !== undefined) {
      if (!this[$key]) {
        throw new DynamoDBToolboxError('actions.incompleteAction', {
          message: 'DeleteItemCommand incomplete: Missing "key" property'
        })
      }

      return (implementation(this[$key], this[$options]) as unknown) as DeleteItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new DeleteItemCommand(this[$entity], this[$key], this[$options]).send()
  }
}
