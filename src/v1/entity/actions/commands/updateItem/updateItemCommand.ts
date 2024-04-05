import type { O } from 'ts-toolbelt'
import { UpdateCommandInput, UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, EntityAction, $entity } from 'v1/entity'
import { EntityFormatter, FormattedItem } from 'v1/entity/actions/format'
import type {
  NoneReturnValuesOption,
  UpdatedOldReturnValuesOption,
  UpdatedNewReturnValuesOption,
  AllOldReturnValuesOption,
  AllNewReturnValuesOption
} from 'v1/options/returnValues'
import { DynamoDBToolboxError } from 'v1/errors'

import type { UpdateItemInput } from './types'
import type { UpdateItemOptions, UpdateItemCommandReturnValuesOption } from './options'
import { updateItemParams } from './updateItemParams'

export const $item = Symbol('$item')
export type $item = typeof $item

export const $options = Symbol('$options')
export type $options = typeof $options

type ReturnedAttributes<
  ENTITY extends EntityV2,
  OPTIONS extends UpdateItemOptions<ENTITY>
> = UpdateItemCommandReturnValuesOption extends OPTIONS['returnValues']
  ? undefined
  : OPTIONS['returnValues'] extends NoneReturnValuesOption
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
  ENTITY extends EntityV2,
  OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
> = O.Merge<
  Omit<UpdateCommandOutput, 'Attributes'>,
  { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> }
>

export class UpdateItemCommand<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>
> extends EntityAction<ENTITY> {
  static operationName = 'update' as const;

  [$item]?: UpdateItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: UpdateItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: UpdateItemInput<ENTITY>): UpdateItemCommand<ENTITY, OPTIONS> {
    return new UpdateItemCommand(this[$entity], nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends UpdateItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): UpdateItemCommand<ENTITY, NEXT_OPTIONS> {
    return new UpdateItemCommand(this[$entity], this[$item], nextOptions)
  }

  params(): UpdateCommandInput {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'UpdateItemCommand incomplete: Missing "item" property'
      })
    }

    return updateItemParams(this[$entity], this[$item], this[$options])
  }

  async send(): Promise<UpdateItemResponse<ENTITY, OPTIONS>> {
    const getItemParams = this.params()

    const commandOutput = await this[$entity].table
      .getDocumentClient()
      .send(new UpdateCommand(getItemParams))

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const { returnValues } = this[$options]

    const formattedItem = (new EntityFormatter(this[$entity]).format(attributes, {
      partial: returnValues === 'UPDATED_NEW' || returnValues === 'UPDATED_OLD'
    }) as unknown) as ReturnedAttributes<ENTITY, OPTIONS>

    return {
      Attributes: formattedItem,
      ...restCommandOutput
    }
  }
}

export type UpdateItemCommandClass = typeof UpdateItemCommand
