import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import { UpdateItemCommand } from '~/entity/actions/commands/updateItem/index.js'
import type {
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from '~/entity/actions/commands/updateItem/index.js'
import { $item, $options } from '~/entity/actions/commands/updateItem/updateItemCommand.js'
import { updateItemParams } from '~/entity/actions/commands/updateItem/updateItemParams/index.js'
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

export class UpdateItemCommandMock<
  ENTITY extends Entity = Entity,
  OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
> implements UpdateItemCommand<ENTITY, OPTIONS>
{
  static actionName = 'update' as const
  static [$actionName] = 'update' as const;

  [$entity]: ENTITY;
  [$item]?: UpdateItemInput<ENTITY>
  item: (nextItem: UpdateItemInput<ENTITY>) => UpdateItemCommandMock<ENTITY, OPTIONS>;
  [$options]: OPTIONS
  options: <NEXT_OPTIONS extends UpdateItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => UpdateItemCommandMock<ENTITY, NEXT_OPTIONS>;

  [$mockedEntity]: MockedEntity<ENTITY>

  constructor(
    mockedEntity: MockedEntity<ENTITY>,
    item?: UpdateItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this[$entity] = mockedEntity[$originalEntity]
    this[$mockedEntity] = mockedEntity
    this[$item] = item
    this[$options] = options

    this.item = nextItem => new UpdateItemCommandMock(this[$mockedEntity], nextItem, this[$options])
    this.options = nextOptions =>
      new UpdateItemCommandMock(this[$mockedEntity], this[$item], nextOptions)
  }

  params = (): UpdateCommandInput => {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'UpdateItemCommand incomplete: Missing "item" property'
      })
    }

    return updateItemParams(this[$entity], this[$item], this[$options])
  }

  send = async (): Promise<UpdateItemResponse<ENTITY, OPTIONS>> => {
    this[$mockedEntity][$receivedActions].update.push([this[$item], this[$options]])

    const implementation = this[$mockedEntity][$mockedImplementations].update

    if (implementation !== undefined) {
      if (!this[$item]) {
        throw new DynamoDBToolboxError('actions.incompleteAction', {
          message: 'UpdateItemCommand incomplete: Missing "item" property'
        })
      }

      return implementation(this[$item], this[$options]) as unknown as UpdateItemResponse<
        ENTITY,
        OPTIONS
      >
    }

    return new UpdateItemCommand(this[$entity], this[$item], this[$options]).send()
  }
}
