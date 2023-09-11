import type { O } from 'ts-toolbelt'
import { DeleteCommandInput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, FormattedItem } from 'v1/entity'
import type {
  NoneReturnValuesOption,
  AllOldReturnValuesOption
} from 'v1/commands/constants/options/returnValues'
import type { KeyInput } from 'v1/commands/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'

import type { CommandClass } from '../class'
import type { DeleteItemOptions, DeleteItemCommandReturnValuesOption } from './options'
import { deleteItemParams } from './deleteItemParams'

type ReturnedAttributes<
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY>
> = DeleteItemCommandReturnValuesOption extends OPTIONS['returnValues']
  ? undefined
  : OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends AllOldReturnValuesOption
  ? FormattedItem<ENTITY> | undefined
  : never

export type DeleteItemResponse<
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
> = O.Merge<
  Omit<DeleteCommandOutput, 'Attributes'>,
  { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> | undefined }
>

export class DeleteItemCommand<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
> implements CommandClass<ENTITY> {
  static commandType = 'delete' as const

  public entity: ENTITY
  public _key?: KeyInput<ENTITY>
  public key: (keyInput: KeyInput<ENTITY>) => DeleteItemCommand<ENTITY, OPTIONS>
  public _options?: OPTIONS
  public options: <NEXT_OPTIONS extends DeleteItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => DeleteItemCommand<ENTITY, NEXT_OPTIONS>

  constructor(entity: ENTITY, _key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    this.entity = entity
    this._key = _key
    this._options = options

    this.key = nextKey => new DeleteItemCommand(this.entity, nextKey, this._options)
    this.options = nextOptions => new DeleteItemCommand(this.entity, this._key, nextOptions)
  }

  params = (): DeleteCommandInput => {
    if (!this._key) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }
    const params = deleteItemParams(this.entity, this._key, this._options)

    return params
  }

  send = async (): Promise<DeleteItemResponse<ENTITY, OPTIONS>> => {
    const deleteItemParams = this.params()

    const commandOutput = await this.entity.table.documentClient.send(
      new DeleteCommand(deleteItemParams)
    )

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const formattedItem = formatSavedItem(this.entity, attributes)

    return {
      Attributes: formattedItem as ReturnedAttributes<ENTITY, OPTIONS>,
      ...restCommandOutput
    }
  }
}

export type DeleteItemCommandClass = typeof DeleteItemCommand
