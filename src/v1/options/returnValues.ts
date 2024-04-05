import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'

export type NoneReturnValuesOption = 'NONE'
export type AllOldReturnValuesOption = 'ALL_OLD'
export type UpdatedOldReturnValuesOption = 'UPDATED_OLD'
export type AllNewReturnValuesOption = 'ALL_NEW'
export type UpdatedNewReturnValuesOption = 'UPDATED_NEW'

export type ReturnValuesOption =
  | NoneReturnValuesOption
  | AllOldReturnValuesOption
  | UpdatedOldReturnValuesOption
  | AllNewReturnValuesOption
  | UpdatedNewReturnValuesOption

export const parseReturnValuesOption = <ALLOWED_RETURN_VALUES_OPTION extends ReturnValuesOption>(
  allowedReturnValuesOptions: Set<ALLOWED_RETURN_VALUES_OPTION>,
  returnValues: ALLOWED_RETURN_VALUES_OPTION
): ALLOWED_RETURN_VALUES_OPTION => {
  if (!allowedReturnValuesOptions.has(returnValues)) {
    throw new DynamoDBToolboxError('operations.invalidReturnValuesOption', {
      message: `Invalid returnValues option: '${String(
        returnValues
      )}'. 'returnValues' must be one of: ${[...allowedReturnValuesOptions].join(', ')}.`,
      payload: { returnValues }
    })
  }

  return returnValues
}
