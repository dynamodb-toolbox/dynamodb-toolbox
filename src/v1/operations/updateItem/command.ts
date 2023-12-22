import type { O } from 'ts-toolbelt'
import { UpdateCommandInput, UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, FormattedItem } from 'v1/entity'
import type {
  NoneReturnValuesOption,
  UpdatedOldReturnValuesOption,
  UpdatedNewReturnValuesOption,
  AllOldReturnValuesOption,
  AllNewReturnValuesOption
} from 'v1/operations/constants/options/returnValues'
import { DynamoDBToolboxError } from 'v1/errors'
import { formatSavedItem } from 'v1/operations/utils/formatSavedItem'

import { EntityOperation } from '../class'
import type { UpdateItemInput } from './types'
import type { UpdateItemOptions, UpdateItemCommandReturnValuesOption } from './options'
import { updateItemParams } from './updateItemParams'

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
> extends EntityOperation<ENTITY> {
  static operationName = 'update' as const

  public _item?: UpdateItemInput<ENTITY>
  public item: (nextItem: UpdateItemInput<ENTITY>) => UpdateItemCommand<ENTITY, OPTIONS>
  public _options: OPTIONS
  public options: <NEXT_OPTIONS extends UpdateItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => UpdateItemCommand<ENTITY, NEXT_OPTIONS>

  constructor(entity: ENTITY, item?: UpdateItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this._item = item
    this._options = options

    this.item = nextItem => new UpdateItemCommand(this._entity, nextItem, this._options)
    this.options = nextOptions => new UpdateItemCommand(this._entity, this._item, nextOptions)
  }

  params = (): UpdateCommandInput => {
    if (!this._item) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'UpdateItemCommand incomplete: Missing "item" property'
      })
    }

    return updateItemParams(this._entity, this._item, this._options)
  }

  send = async (): Promise<UpdateItemResponse<ENTITY, OPTIONS>> => {
    const getItemParams = this.params()

    const commandOutput = await this._entity.table.documentClient.send(
      new UpdateCommand(getItemParams)
    )

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const { returnValues } = this._options

    const formattedItem = (formatSavedItem(this._entity, attributes, {
      partial: returnValues === 'UPDATED_NEW' || returnValues === 'UPDATED_OLD'
    }) as unknown) as ReturnedAttributes<ENTITY, OPTIONS>

    return {
      Attributes: formattedItem,
      ...restCommandOutput
    }
  }
}

export type UpdateItemCommandClass = typeof UpdateItemCommand
