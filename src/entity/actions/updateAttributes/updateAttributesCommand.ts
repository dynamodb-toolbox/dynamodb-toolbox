import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { UpdateItemResponse } from '~/entity/actions/update/index.js'
import { $sentArgs } from '~/entity/constants.js'
import { sender } from '~/entity/decorator.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { $item, $options } from './constants.js'
import type { UpdateAttributesOptions } from './options.js'
import type { UpdateAttributesInput } from './types.js'
import { updateAttributesParams } from './updateAttributesParams/index.js'

export class UpdateAttributesCommand<
    ENTITY extends Entity = Entity,
    OPTIONS extends UpdateAttributesOptions<ENTITY> = UpdateAttributesOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements EntitySendableAction<ENTITY>
{
  static override actionName = 'update' as const;

  [$item]?: UpdateAttributesInput<ENTITY>;
  [$options]: OPTIONS

  constructor(
    entity: ENTITY,
    item?: UpdateAttributesInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: UpdateAttributesInput<ENTITY>): UpdateAttributesCommand<ENTITY, OPTIONS> {
    return new UpdateAttributesCommand(this.entity, nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends UpdateAttributesOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): UpdateAttributesCommand<ENTITY, NEXT_OPTIONS> {
    return new UpdateAttributesCommand(this.entity, this[$item], nextOptions)
  }

  [$sentArgs](): [UpdateAttributesInput<ENTITY>, UpdateAttributesOptions<ENTITY>] {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'UpdateAttributesCommand incomplete: Missing "item" property'
      })
    }

    return [this[$item], this[$options]]
  }

  params(): UpdateCommandInput {
    const [item, options] = this[$sentArgs]()

    return updateAttributesParams(this.entity, item, options)
  }

  @sender()
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
    }) as unknown as UpdateItemResponse<ENTITY, OPTIONS>['Attributes']

    return {
      Attributes: formattedItem,
      ...restCommandOutput
    }
  }
}
