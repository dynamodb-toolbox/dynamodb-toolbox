import { PutCommand } from '@aws-sdk/lib-dynamodb'
import type { PutCommandInput, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/actions/format/index.js'
import { $sentArgs } from '~/entity/constants.js'
import { sender } from '~/entity/decorator.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { AllOldReturnValuesOption, NoneReturnValuesOption } from '~/options/returnValues.js'
import type { Merge } from '~/types/merge.js'

import { $item, $options } from './constants.js'
import type { PutItemOptions } from './options.js'
import { putItemParams } from './putItemParams/index.js'
import type { PutItemInput } from './types.js'

type ReturnedAttributes<
  ENTITY extends Entity,
  OPTIONS extends PutItemOptions<ENTITY>
> = OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends AllOldReturnValuesOption
    ? FormattedItem<ENTITY> | undefined
    : never

export type PutItemResponse<
  ENTITY extends Entity,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> = Merge<
  Omit<PutCommandOutput, 'Attributes'>,
  { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> }
>

export class PutItemCommand<
    ENTITY extends Entity = Entity,
    OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements EntitySendableAction<ENTITY>
{
  static override actionName = 'put' as const;

  [$item]?: PutItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: PutItemInput<ENTITY>): PutItemCommand<ENTITY, OPTIONS> {
    return new PutItemCommand(this.entity, nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): PutItemCommand<ENTITY, NEXT_OPTIONS> {
    return new PutItemCommand(this.entity, this[$item], nextOptions)
  }

  [$sentArgs](): [PutItemInput<ENTITY>, PutItemOptions<ENTITY>] {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }

    return [this[$item], this[$options]]
  }

  params(): PutCommandInput {
    const [item, options] = this[$sentArgs]()

    return putItemParams(this.entity, item, options)
  }

  @sender()
  async send(): Promise<PutItemResponse<ENTITY, OPTIONS>> {
    const putItemParams = this.params()

    const commandOutput = await this.entity.table
      .getDocumentClient()
      .send(new PutCommand(putItemParams))

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const formattedItem = new EntityFormatter(this.entity).format(attributes)

    return {
      Attributes: formattedItem as any,
      ...restCommandOutput
    }
  }
}
