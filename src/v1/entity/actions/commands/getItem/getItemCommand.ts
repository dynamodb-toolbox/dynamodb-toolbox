import type { O } from 'ts-toolbelt'
import { GetCommandInput, GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, EntityAction, $entity } from 'v1/entity'
import { EntityFormatter, FormattedItem } from 'v1/entity/actions/format'
import type { KeyInput } from 'v1/operations/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { GetItemOptions } from './options'
import { getItemParams } from './getItemParams'

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
  static operationName = 'get' as const;

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
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
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
