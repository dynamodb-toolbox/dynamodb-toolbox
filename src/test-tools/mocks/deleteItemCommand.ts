import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { $key, $options } from '~/entity/actions/commands/deleteItem/deleteItemCommand.js'
import { deleteItemParams } from '~/entity/actions/commands/deleteItem/deleteItemParams/index.js'
import {
  DeleteItemCommand,
  DeleteItemOptions,
  DeleteItemResponse
} from '~/entity/actions/commands/deleteItem/index.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import { $entity, Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import {
  $actionName,
  $mockedEntity,
  $mockedImplementations,
  $originalEntity,
  $receivedActions
} from './constants.js'
import type { MockedEntity } from './entity.js'

export class DeleteItemCommandMock<
  ENTITY extends Entity = Entity,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
> implements DeleteItemCommand<ENTITY, OPTIONS>
{
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

      return implementation(this[$key], this[$options]) as unknown as DeleteItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new DeleteItemCommand(this[$entity], this[$key], this[$options]).send()
  }
}
