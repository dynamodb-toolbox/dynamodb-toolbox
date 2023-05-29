import type { O } from 'ts-toolbelt'
import { GetCommandInput, GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, KeyInput, FormattedItem } from 'v1/entity'
import type { AnyAttributePath } from 'v1/commands/types/paths'
import { DynamoDBToolboxError } from 'v1/errors'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'

import type { CommandClass } from '../class'
import type { GetItemOptions } from './options'
import { getItemParams } from './getItemParams'

export type GetItemResponse<
  ENTITY extends EntityV2,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> = Promise<
  O.Merge<
    Omit<GetCommandOutput, 'Item'>,
    {
      Item?:
        | (OPTIONS['attributes'] extends AnyAttributePath<ENTITY['schema']>[]
            ? FormattedItem<ENTITY, OPTIONS['attributes'][number]>
            : FormattedItem<ENTITY>)
        | undefined
    }
  >
>

export class GetItemCommand<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> implements CommandClass<ENTITY> {
  static commandType = 'get' as const

  public entity: ENTITY
  public _key?: KeyInput<ENTITY>
  public key: (key: KeyInput<ENTITY>) => GetItemCommand<ENTITY, OPTIONS>
  public _options: OPTIONS
  public options: <NEXT_OPTIONS extends GetItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => GetItemCommand<ENTITY, NEXT_OPTIONS>

  private _cachedParams?: GetCommandInput

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    this.entity = entity
    this._key = key
    this._options = options

    this.key = nextKey => new GetItemCommand(this.entity, nextKey, this._options)
    this.options = nextOptions => new GetItemCommand(this.entity, this._key, nextOptions)
  }

  params = (): GetCommandInput => {
    if (this._cachedParams) return this._cachedParams

    if (!this._key) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }
    const params = getItemParams(this.entity, this._key, this._options)
    this._cachedParams = params

    return params
  }

  send = async (): GetItemResponse<ENTITY, OPTIONS> => {
    const getItemParams = this.params()

    const commandOutput = await this.entity.table.documentClient.send(new GetCommand(getItemParams))

    const { Item: item, ...restCommandOutput } = commandOutput

    if (item === undefined) {
      return restCommandOutput
    }

    const { attributes } = this._options
    const formattedItem = formatSavedItem(this.entity, item, { attributes })

    return {
      Item: formattedItem,
      ...restCommandOutput
    }
  }
}

export type GetItemCommandClass = typeof GetItemCommand
