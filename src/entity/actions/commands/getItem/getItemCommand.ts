import { GetCommand, GetCommandInput, GetCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { O } from 'ts-toolbelt'

import { EntityFormatter, FormattedItem } from '~/entity/actions/format.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import { $entity, EntityAction, EntityV2 } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { getItemParams } from './getItemParams/index.js'
import type { GetItemOptions } from './options.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export type GetItemResponse<
  ENTITY extends EntityV2,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> = O.Merge<
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
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>
> extends EntityAction<ENTITY> {
  static actionName = 'get' as const;

  [$key]?: KeyInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInput<ENTITY>): GetItemCommand<ENTITY, OPTIONS> {
    return new GetItemCommand(this[$entity], nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends GetItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): GetItemCommand<ENTITY, NEXT_OPTIONS> {
    return new GetItemCommand(this[$entity], this[$key], nextOptions)
  }

  params(): GetCommandInput {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'GetItemCommand incomplete: Missing "key" property'
      })
    }

    return getItemParams(this[$entity], this[$key], this[$options])
  }

  async send(): Promise<GetItemResponse<ENTITY, OPTIONS>> {
    const getItemParams = this.params()

    const commandOutput = await this[$entity].table
      .getDocumentClient()
      .send(new GetCommand(getItemParams))

    const { Item: item, ...restCommandOutput } = commandOutput

    if (item === undefined) {
      return restCommandOutput
    }

    const { attributes } = this[$options]

    const formattedItem = new EntityFormatter(this[$entity]).format(item, { attributes })

    return {
      Item: formattedItem as any,
      ...restCommandOutput
    }
  }
}

export type GetItemCommandClass = typeof GetItemCommand
