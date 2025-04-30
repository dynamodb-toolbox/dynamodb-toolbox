import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Finder, SubSchema } from '~/schema/actions/finder/index.js'
import type { Deduper } from '~/schema/actions/utils/deduper.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { SchemaCondition } from '../../condition.js'

export const getComparedSubSchemas = (
  schemaFinder: Finder,
  comparedValue: string | number | bigint | boolean | Uint8Array | { attr: string }
): SubSchema[] | undefined =>
  isObject(comparedValue) && 'attr' in comparedValue
    ? schemaFinder.search(comparedValue.attr)
    : undefined

export const joinDedupedConditions = (
  dedupedConditions: Deduper<SchemaCondition>,
  attributePath: string
): SchemaCondition => {
  const [conditionsHead, ...conditionsTail] = dedupedConditions.values

  if (conditionsHead === undefined) {
    throw new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
      message: `Unable to match expression attribute path with schema: ${attributePath}`,
      payload: { attributePath }
    })
  }

  return conditionsTail.length > 0 ? { or: [conditionsHead, ...conditionsTail] } : conditionsHead
}
