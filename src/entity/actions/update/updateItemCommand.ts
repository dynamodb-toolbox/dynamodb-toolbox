import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import type { UpdateCommandInput, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { O } from 'ts-toolbelt'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/actions/format/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  AllNewReturnValuesOption,
  AllOldReturnValuesOption,
  NoneReturnValuesOption,
  UpdatedNewReturnValuesOption,
  UpdatedOldReturnValuesOption
} from '~/options/returnValues.js'

import { $item, $options } from './constants.js'
import type { UpdateItemOptions } from './options.js'
import type { UpdateItemInput } from './types.js'
import { updateItemParams } from './updateItemParams/index.js'

type ReturnedAttributes<
  ENTITY extends Entity,
  OPTIONS extends UpdateItemOptions<ENTITY>
> = OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends UpdatedOldReturnValuesOption | UpdatedNewReturnValuesOption
    ?
        | FormattedItem<
            ENTITY,
            {
              partial: OPTIONS['returnValues'] extends
                | UpdatedOldReturnValuesOption
                | UpdatedNewReturnValuesOption
                ? true
                : false
            }
          >
        | undefined
    : OPTIONS['returnValues'] extends AllNewReturnValuesOption | AllOldReturnValuesOption
      ? FormattedItem<ENTITY> | undefined
      : never

export type UpdateItemResponse<
  ENTITY extends Entity,
  OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
> = O.Merge<
  Omit<UpdateCommandOutput, 'Attributes'>,
  { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> }
>

export class UpdateItemCommand<
  ENTITY extends Entity = Entity,
  OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
> extends EntityAction<ENTITY> {
  static actionName = 'update' as const;

  [$item]?: UpdateItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: UpdateItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: UpdateItemInput<ENTITY>): UpdateItemCommand<ENTITY, OPTIONS> {
    return new UpdateItemCommand(this.entity, nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends UpdateItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): UpdateItemCommand<ENTITY, NEXT_OPTIONS> {
    return new UpdateItemCommand(this.entity, this[$item], nextOptions)
  }

  params(): UpdateCommandInput {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'UpdateItemCommand incomplete: Missing "item" property'
      })
    }

    return updateItemParams(this.entity, this[$item], this[$options])
  }

  async send(): Promise<UpdateItemResponse<ENTITY, OPTIONS>> {
    const getItemParams = this.params()

    const commandOutput = await this.entity.table
      .getDocumentClient()
      .send(new UpdateCommand(getItemParams))

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const { returnValues } = this[$options]

    const formattedItem = new EntityFormatter(this.entity).format(attributes, {
      partial: returnValues === 'UPDATED_NEW' || returnValues === 'UPDATED_OLD'
    }) as unknown as ReturnedAttributes<ENTITY, OPTIONS>

    return {
      Attributes: formattedItem,
      ...restCommandOutput
    }
  }
}

export type UpdateItemCommandClass = typeof UpdateItemCommand
