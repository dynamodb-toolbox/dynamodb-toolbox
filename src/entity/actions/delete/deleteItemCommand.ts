import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import type { DeleteCommandInput, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import { $sentArgs } from '~/entity/constants.js'
import { interceptable } from '~/entity/decorator.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import type { FormattedItem } from '~/entity/index.js'
import type { KeyInputItem } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { AllOldReturnValuesOption, NoneReturnValuesOption } from '~/options/returnValues.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { Merge } from '~/types/merge.js'

import { $key, $options } from './constants.js'
import { deleteItemParams } from './deleteItemParams/index.js'
import type { DeleteItemOptions } from './options.js'

type ReturnedAttributes<
  ENTITY extends Entity,
  OPTIONS extends DeleteItemOptions<ENTITY>
> = OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends AllOldReturnValuesOption
    ? FormattedItem<ENTITY> | undefined
    : never

export type DeleteItemResponse<
  ENTITY extends Entity,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
> = Merge<
  Omit<DeleteCommandOutput, 'Attributes'>,
  { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> | undefined }
>

export class DeleteItemCommand<
    ENTITY extends Entity = Entity,
    OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements EntitySendableAction<ENTITY>
{
  static override actionName = 'delete' as const;

  [$key]?: KeyInputItem<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInputItem<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInputItem<ENTITY>): DeleteItemCommand<ENTITY, OPTIONS> {
    return new DeleteItemCommand(this.entity, nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends DeleteItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): DeleteItemCommand<ENTITY, NEXT_OPTIONS> {
    return new DeleteItemCommand(this.entity, this[$key], nextOptions)
  }

  [$sentArgs](): [KeyInputItem<ENTITY>, DeleteItemOptions<ENTITY>] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    return [this[$key], this[$options]]
  }

  params(): DeleteCommandInput {
    return deleteItemParams(this.entity, ...this[$sentArgs]())
  }

  @interceptable()
  async send(
    documentClientOptions?: DocumentClientOptions
  ): Promise<DeleteItemResponse<ENTITY, OPTIONS>> {
    const deleteItemParams = this.params()

    const commandOutput = await this.entity.table
      .getDocumentClient()
      .send(new DeleteCommand(deleteItemParams), documentClientOptions)

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
