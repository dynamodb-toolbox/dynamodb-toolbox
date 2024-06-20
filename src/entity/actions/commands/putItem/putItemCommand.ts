import { PutCommand, PutCommandInput, PutCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { O } from 'ts-toolbelt'

import { EntityFormatter, FormattedItem } from '~/entity/actions/format.js'
import { $entity, EntityAction, EntityV2 } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { AllOldReturnValuesOption, NoneReturnValuesOption } from '~/options/returnValues.js'

import type { PutItemOptions } from './options.js'
import { putItemParams } from './putItemParams/index.js'
import type { PutItemInput } from './types.js'

export const $item = Symbol('$item')
export type $item = typeof $item

export const $options = Symbol('$options')
export type $options = typeof $options

type ReturnedAttributes<
  ENTITY extends EntityV2,
  OPTIONS extends PutItemOptions<ENTITY>
> = OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends AllOldReturnValuesOption
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
> extends EntityAction<ENTITY> {
  static actionName = 'put' as const;

  [$item]?: PutItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: PutItemInput<ENTITY>): PutItemCommand<ENTITY, OPTIONS> {
    return new PutItemCommand(this[$entity], nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends PutItemOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): PutItemCommand<ENTITY, NEXT_OPTIONS> {
    return new PutItemCommand(this[$entity], this[$item], nextOptions)
  }

  params(): PutCommandInput {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this[$entity], this[$item], this[$options])
  }

  async send(): Promise<PutItemResponse<ENTITY, OPTIONS>> {
    const putItemParams = this.params()

    const commandOutput = await this[$entity].table
      .getDocumentClient()
      .send(new PutCommand(putItemParams))

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const formattedItem = new EntityFormatter(this[$entity]).format(attributes)

    return {
      Attributes: formattedItem as any,
      ...restCommandOutput
    }
  }
}

export type PutItemCommandClass = typeof PutItemCommand
