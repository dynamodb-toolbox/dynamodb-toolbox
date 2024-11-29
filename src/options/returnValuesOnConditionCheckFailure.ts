import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

import type { AllOldReturnValuesOption, NoneReturnValuesOption } from './returnValues.js'

export type ReturnValuesOnConditionCheckFailureOption =
  | NoneReturnValuesOption
  | AllOldReturnValuesOption

const returnValuesOnConditionCheckFailureOptions =
  new Set<ReturnValuesOnConditionCheckFailureOption>(['NONE', 'ALL_OLD'])

export const parseReturnValuesOnConditionCheckFailureOption = (
  returnValues: ReturnValuesOnConditionCheckFailureOption
): ReturnValuesOnConditionCheckFailureOption => {
  if (!returnValuesOnConditionCheckFailureOptions.has(returnValues)) {
    throw new DynamoDBToolboxError('options.invalidReturnValuesOnConditionCheckFailureOption', {
      message: `Invalid returnValues option: '${String(
        returnValues
      )}'. 'returnValues' must be one of: ${[...returnValuesOnConditionCheckFailureOptions].join(', ')}.`,
      payload: { returnValues }
    })
  }

  return returnValues
}
