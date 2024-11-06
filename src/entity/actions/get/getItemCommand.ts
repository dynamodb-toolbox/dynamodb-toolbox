import { GetCommand } from '@aws-sdk/lib-dynamodb'
import type { GetCommandInput, GetCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import { $sentArgs } from '~/entity/constants.js'
import { sender } from '~/entity/decorator.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import type { FormattedItem } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import type { KeyInputItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { Merge } from '~/types/merge.js'

import { $key, $options } from './constants.js'
import { getItemParams } from './getItemParams/index.js'
import type { GetItemOptions } from './options.js'

export type GetItemResponse<
  ENTITY extends Entity,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> = Merge<
  Omit<GetCommandOutput, 'Item'>,
  {
    Item?: FormattedItem<
      ENTITY,
      {
        attributes: OPTIONS extends { attributes: string[] }
          ? OPTIONS['attributes'][number]
          : undefined
      }
    >
  }
>

export class GetItemCommand<
    ENTITY extends Entity = Entity,
    OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements EntitySendableAction<ENTITY>
{
  static override actionName = 'get' as const;

  [$key]?: KeyInputItem<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInputItem<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInputItem<ENTITY>): GetItemCommand<ENTITY, OPTIONS> {
    return new GetItemCommand(this.entity, nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends GetItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): GetItemCommand<ENTITY, NEXT_OPTIONS> {
    return new GetItemCommand(this.entity, this[$key], nextOptions)
  }

  [$sentArgs](): [KeyInputItem<ENTITY>, GetItemOptions<ENTITY>] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }

    return [this[$key], this[$options]]
  }

  params(): GetCommandInput {
    return getItemParams(this.entity, ...this[$sentArgs]())
  }

  @sender()
  async send(
    documentClientOptions?: DocumentClientOptions
  ): Promise<GetItemResponse<ENTITY, OPTIONS>> {
    const getItemParams = this.params()

    const commandOutput = await this.entity.table
      .getDocumentClient()
      .send(new GetCommand(getItemParams), documentClientOptions)

    const { Item: item, ...restCommandOutput } = commandOutput

    if (item === undefined) {
      return restCommandOutput
    }

    const { attributes } = this[$options]

    const formattedItem = new EntityFormatter(this.entity).format(item, { attributes })

    return {
      Item: formattedItem as any,
      ...restCommandOutput
    }
  }
}
