import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { ReturnValuesOption } from 'v1/operations/constants/options/returnValues'

export const parseReturnValuesOption = <ALLOWED_RETURN_VALUES_OPTION extends ReturnValuesOption>(
  allowedReturnValuesOptions: Set<ALLOWED_RETURN_VALUES_OPTION>,
  returnValues: ALLOWED_RETURN_VALUES_OPTION
): ALLOWED_RETURN_VALUES_OPTION => {
  if (!allowedReturnValuesOptions.has(returnValues)) {
    throw new DynamoDBToolboxError('commands.invalidReturnValuesOption', {
      message: `Invalid returnValues option: '${String(
        returnValues
      )}'. 'returnValues' must be one of: ${[...allowedReturnValuesOptions].join(', ')}.`,
      payload: { returnValues }
    })
  }

  return returnValues
}
