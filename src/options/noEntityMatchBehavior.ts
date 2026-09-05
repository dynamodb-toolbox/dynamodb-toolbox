import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

/**
 * `noEntityMatchBehavior` option that discards items matching no entity.
 */
export type DiscardNoEntityMatchBehavior = 'DISCARD'
/**
 * `noEntityMatchBehavior` option that throws on items matching no entity.
 */
export type ThrowNoEntityMatchBehavior = 'THROW'

/**
 * Accepted values for the `noEntityMatchBehavior` command option.
 */
export type NoEntityMatchBehavior = DiscardNoEntityMatchBehavior | ThrowNoEntityMatchBehavior

export const noEntityMatchBehaviorSet = new Set<NoEntityMatchBehavior>(['DISCARD', 'THROW'])

/**
 * Validate a `noEntityMatchBehavior` option value, throwing on an unknown value.
 */
export const parseNoEntityMatchBehavior = (
  noEntityMatchBehavior: NoEntityMatchBehavior
): NoEntityMatchBehavior => {
  if (!noEntityMatchBehaviorSet.has(noEntityMatchBehavior)) {
    throw new DynamoDBToolboxError('options.invalidNoEntityMatchBehaviorOption', {
      message: `Invalid noEntityMatchBehavior option: '${String(noEntityMatchBehavior)}'. 'noEntityMatchBehavior' must be one of: ${[
        ...noEntityMatchBehaviorSet
      ].join(', ')}.`,
      payload: { noEntityMatchBehavior }
    })
  }

  return noEntityMatchBehavior
}
