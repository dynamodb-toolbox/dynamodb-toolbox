import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import type { UpdateCommandInput, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import { $sentArgs } from '~/entity/constants.js'
import { interceptable } from '~/entity/decorator.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import type { FormattedItem } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  AllNewReturnValuesOption,
  AllOldReturnValuesOption,
  NoneReturnValuesOption,
  UpdatedNewReturnValuesOption,
  UpdatedOldReturnValuesOption
} from '~/options/returnValues.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { Merge } from '~/types/merge.js'

import { $item, $options } from './constants.js'
import type { UpdateItemOptions } from './options.js'
import type { UpdateItemInput } from './types.js'
import { updateItemParams } from './updateItemParams/index.js'

export type ReturnedAttributes<
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
> = Merge<
  Omit<UpdateCommandOutput, 'Attributes'>,
  {
    Attributes?: ReturnedAttributes<ENTITY, OPTIONS>
    ToolboxItem: UpdateItemInput<ENTITY, { filled: true }>
  }
>

export class UpdateItemCommand<
    ENTITY extends Entity = Entity,
    OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements EntitySendableAction<ENTITY>
{
  static override actionName = 'updateItem' as const;

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

  [$sentArgs](): [UpdateItemInput<ENTITY>, UpdateItemOptions<ENTITY>] {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'UpdateItemCommand incomplete: Missing "item" property'
      })
    }

    return [this[$item], this[$options]]
  }

  params(): UpdateCommandInput & { ToolboxItem: UpdateItemInput<ENTITY, { filled: true }> } {
    const [item, options] = this[$sentArgs]()

    return updateItemParams(this.entity, item, options)
  }

  @interceptable()
  async send(
    documentClientOptions?: DocumentClientOptions
  ): Promise<UpdateItemResponse<ENTITY, OPTIONS>> {
    const { ToolboxItem, ...getItemParams } = this.params()

    const commandOutput = await this.entity.table
      .getDocumentClient()
      .send(new UpdateCommand(getItemParams), documentClientOptions)

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return { ToolboxItem, ...restCommandOutput }
    }

    const { returnValues } = this[$options]

    const formattedItem = new EntityFormatter(this.entity).format(attributes, {
      partial: returnValues === 'UPDATED_NEW' || returnValues === 'UPDATED_OLD'
    }) as unknown as ReturnedAttributes<ENTITY, OPTIONS>

    return { ToolboxItem, Attributes: formattedItem, ...restCommandOutput }
  }
}
