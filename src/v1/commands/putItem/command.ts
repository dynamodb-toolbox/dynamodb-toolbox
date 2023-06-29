import type { O } from 'ts-toolbelt'
import { PutCommandInput, PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, PutItemInput, FormattedItem } from 'v1/entity'
import type {
  NoneReturnValuesOption,
  UpdatedOldReturnValuesOption,
  UpdatedNewReturnValuesOption,
  AllOldReturnValuesOption,
  AllNewReturnValuesOption
} from 'v1/commands/constants/options/returnValues'
import { DynamoDBToolboxError } from 'v1/errors'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'

import type { CommandClass } from '../class'
import type { PutItemOptions, PutItemCommandReturnValuesOption } from './options'
import { putItemParams } from './putItemParams'

type ReturnedAttributes<
  ENTITY extends EntityV2,
  OPTIONS extends PutItemOptions<ENTITY>
> = PutItemCommandReturnValuesOption extends OPTIONS['returnValues']
  ? undefined
  : OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends UpdatedOldReturnValuesOption | UpdatedNewReturnValuesOption
  ? FormattedItem<ENTITY, { partial: true }> | undefined
  : OPTIONS['returnValues'] extends AllNewReturnValuesOption | AllOldReturnValuesOption
  ? FormattedItem<ENTITY> | undefined
  : never

export type PutItemResponse<
  ENTITY extends EntityV2,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> = Promise<
  O.Merge<
    Omit<PutCommandOutput, 'Attributes'>,
    { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> }
  >
>

export class PutItemCommand<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> implements CommandClass<ENTITY> {
  static commandType = 'put' as const

  public entity: ENTITY
  public _item?: PutItemInput<ENTITY, false>
  public item: (nextItem: PutItemInput<ENTITY>) => PutItemCommand<ENTITY, OPTIONS>
  public _options: OPTIONS
  public options: <NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => PutItemCommand<ENTITY, NEXT_OPTIONS>

  private _cachedParams?: PutCommandInput

  constructor(
    entity: ENTITY,
    item?: PutItemInput<ENTITY, false>,
    options: OPTIONS = {} as OPTIONS
  ) {
    this.entity = entity
    this._item = item
    this._options = options

    this.item = nextItem => new PutItemCommand(this.entity, nextItem, this._options)
    this.options = nextOptions => new PutItemCommand(this.entity, this._item, nextOptions)
  }

  params = (): PutCommandInput => {
    if (this._cachedParams) return this._cachedParams

    if (!this._item) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }
    const params = putItemParams(this.entity, this._item, this._options)
    this._cachedParams = params

    return params
  }

  send = async (): PutItemResponse<ENTITY, OPTIONS> => {
    const getItemParams = this.params()

    const commandOutput = await this.entity.table.documentClient.send(new PutCommand(getItemParams))

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    // TODO: Create parseSavedAttributes util that handles partial Items (for the moment, it will throw)
    // (returned for UpdatedOld/UpdatedNew returnValues option)
    // (Also: is the partial flat or deep ?)
    const formattedItem = formatSavedItem(this.entity, attributes)

    return {
      Attributes: formattedItem as ReturnedAttributes<ENTITY, OPTIONS>,
      ...restCommandOutput
    }
  }
}

export type PutItemCommandClass = typeof PutItemCommand
