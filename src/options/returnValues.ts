import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

/**
 * `returnValues` option requesting no returned attributes.
 */
export type NoneReturnValuesOption = 'NONE'
/**
 * `returnValues` option requesting all attributes as they were before the write.
 */
export type AllOldReturnValuesOption = 'ALL_OLD'
/**
 * `returnValues` option requesting the updated attributes as they were before the write.
 */
export type UpdatedOldReturnValuesOption = 'UPDATED_OLD'
/**
 * `returnValues` option requesting all attributes as they are after the write.
 */
export type AllNewReturnValuesOption = 'ALL_NEW'
/**
 * `returnValues` option requesting the updated attributes as they are after the write.
 */
export type UpdatedNewReturnValuesOption = 'UPDATED_NEW'

/**
 * Accepted values for the `returnValues` command option.
 */
export type ReturnValuesOption =
  | NoneReturnValuesOption
  | AllOldReturnValuesOption
  | UpdatedOldReturnValuesOption
  | AllNewReturnValuesOption
  | UpdatedNewReturnValuesOption

/**
 * Validate a `returnValues` option value against the allowed set for a command.
 */
export const parseReturnValuesOption = <ALLOWED_RETURN_VALUES_OPTION extends ReturnValuesOption>(
  allowedReturnValuesOptions: Set<ALLOWED_RETURN_VALUES_OPTION>,
  returnValues: ALLOWED_RETURN_VALUES_OPTION
): ALLOWED_RETURN_VALUES_OPTION => {
  if (!allowedReturnValuesOptions.has(returnValues)) {
    throw new DynamoDBToolboxError('options.invalidReturnValuesOption', {
      message: `Invalid returnValues option: '${String(
        returnValues
      )}'. 'returnValues' must be one of: ${[...allowedReturnValuesOptions].join(', ')}.`,
      payload: { returnValues }
    })
  }

  return returnValues
}
