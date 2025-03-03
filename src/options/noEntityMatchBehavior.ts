import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

export type DiscardNoEntityMatchBehavior = 'DISCARD'
export type ThrowNoEntityMatchBehavior = 'THROW'

export type NoEntityMatchBehavior = DiscardNoEntityMatchBehavior | ThrowNoEntityMatchBehavior

export const noEntityMatchBehaviorSet = new Set<NoEntityMatchBehavior>(['DISCARD', 'THROW'])

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
