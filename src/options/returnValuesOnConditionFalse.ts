import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

import type { AllOldReturnValuesOption, NoneReturnValuesOption } from './returnValues.js'

export type ReturnValuesOnConditionFalseOption = NoneReturnValuesOption | AllOldReturnValuesOption

const returnValuesOnConditionFalseOptions = new Set<ReturnValuesOnConditionFalseOption>([
  'NONE',
  'ALL_OLD'
])

export const parseReturnValuesOnConditionFalseOption = (
  returnValues: ReturnValuesOnConditionFalseOption
): ReturnValuesOnConditionFalseOption => {
  if (!returnValuesOnConditionFalseOptions.has(returnValues)) {
    throw new DynamoDBToolboxError('options.invalidReturnValuesOnConditionFalseOption', {
      message: `Invalid returnValues option: '${String(
        returnValues
      )}'. 'returnValuesOnConditionFalse' must be one of: ${[...returnValuesOnConditionFalseOptions].join(', ')}.`,
      payload: { returnValues }
    })
  }

  return returnValues
}
