import type { O } from 'ts-toolbelt'
import { PutCommandInput, PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity/class'
import type { FormattedItem } from 'v1/entity/generics'
import type {
  NoneReturnValuesOption,
  UpdatedOldReturnValuesOption,
  UpdatedNewReturnValuesOption,
  AllOldReturnValuesOption,
  AllNewReturnValuesOption
} from 'v1/operations/constants/options/returnValues'
import { EntityFormatter } from 'v1/operations/format'
import { DynamoDBToolboxError } from 'v1/errors'

import { EntityOperation, $entity } from '../class'
import type { PutItemInput } from './types'
import type { PutItemOptions, PutItemCommandReturnValuesOption } from './options'
import { putItemParams } from './putItemParams'

export const $item = Symbol('$item')
export type $item = typeof $item

export const $options = Symbol('$options')
export type $options = typeof $options

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
> extends EntityOperation<ENTITY> {
  static operationName = 'put' as const;

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
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'PutItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this[$entity], this[$item], this[$options])
  }

  async send(): Promise<PutItemResponse<ENTITY, OPTIONS>> {
    const putItemParams = this.params()

    const commandOutput = await this[$entity].table.documentClient.send(
      new PutCommand(putItemParams)
    )

    const { Attributes: attributes, ...restCommandOutput } = commandOutput

    if (attributes === undefined) {
      return restCommandOutput
    }

    const { returnValues } = this[$options]

    const formattedItem = new EntityFormatter(this[$entity]).format(attributes, {
      partial: returnValues === 'UPDATED_NEW' || returnValues === 'UPDATED_OLD'
    })

    return {
      Attributes: formattedItem as any,
      ...restCommandOutput
    }
  }
}

export type PutItemCommandClass = typeof PutItemCommand
