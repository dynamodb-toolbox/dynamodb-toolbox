import type { O } from 'ts-toolbelt'
import { PutCommandInput, PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, FormattedItem } from 'v1/entity'
import type {
  NoneReturnValuesOption,
  UpdatedOldReturnValuesOption,
  UpdatedNewReturnValuesOption,
  AllOldReturnValuesOption,
  AllNewReturnValuesOption
} from 'v1/commands/constants/options/returnValues'
import { DynamoDBToolboxError } from 'v1/errors'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'

import { EntityCommand } from '../class'
import type { PutItemInput } from './types'
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

export type PutItemResponse<
  ENTITY extends EntityV2,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> = O.Merge<
  Omit<PutCommandOutput, 'Attributes'>,
  { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> }
>

export class PutItemCommand<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>
> extends EntityCommand<ENTITY> {
  static commandName = 'put' as const

  private _item?: PutItemInput<ENTITY>
  public item: (nextItem: PutItemInput<ENTITY>) => PutItemCommand<ENTITY, OPTIONS>
  private _options: OPTIONS
  public options: <NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => PutItemCommand<ENTITY, NEXT_OPTIONS>

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this._item = item
    this._options = options

    this.item = nextItem => new PutItemCommand(this._entity, nextItem, this._options)
    this.options = nextOptions => new PutItemCommand(this._entity, this._item, nextOptions)
  }

  params = (): PutCommandInput => {
    if (!this._item) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this._entity, this._item, this._options)
  }

  send = async (): Promise<PutItemResponse<ENTITY, OPTIONS>> => {
    const putItemParams = this.params()

    const commandOutput = await this._entity.table.documentClient.send(
      new PutCommand(putItemParams)
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

export type PutItemCommandClass = typeof PutItemCommand
