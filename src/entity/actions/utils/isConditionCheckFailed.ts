import type { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { Entity, FormattedItem } from '~/entity/index.js'

export type ConditionCheckFailedError<ENTITY extends Entity = Entity> =
  ConditionalCheckFailedException & { FormattedItem?: FormattedItem<ENTITY> }

export type IsConditionCheckFailed = <ENTITY extends Entity = Entity>(
  error: unknown,
  entity?: ENTITY
) => error is ConditionCheckFailedError<ENTITY>

export const isConditionCheckFailed: IsConditionCheckFailed = <ENTITY extends Entity = Entity>(
  error: unknown,
  entity?: ENTITY
): error is ConditionCheckFailedError<ENTITY> => {
  if (
    typeof error !== 'object' ||
    error === null ||
    (error as { name?: unknown }).name !== 'ConditionalCheckFailedException'
  ) {
    return false
  }

  const conditionCheckError = error as ConditionCheckFailedError<ENTITY>

  if (
    entity !== undefined &&
    conditionCheckError.FormattedItem === undefined &&
    conditionCheckError.Item !== undefined
  ) {
    try {
      const unmarshalledItem = unmarshall(conditionCheckError.Item)
      conditionCheckError.FormattedItem = entity.build(EntityFormatter).format(unmarshalledItem)
      // eslint-disable-next-line no-empty
    } catch {}
  }

  return true
}
