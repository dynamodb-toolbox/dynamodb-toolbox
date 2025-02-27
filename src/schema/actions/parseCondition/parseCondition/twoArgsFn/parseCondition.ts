import type { AttrSchema } from '~/attributes/index.js'
import { StringSchema } from '~/attributes/string/schema.js'
import { writable } from '~/utils/writable.js'

import type { ConditionType } from '../../condition.js'
import type { ConditionParser } from '../../conditionParser.js'
import { isTwoArgsFnOperator } from './types.js'
import type { TwoArgsFnCondition, TwoArgsFnOperator } from './types.js'

const twoArgsFnOperatorExpression: Record<TwoArgsFnOperator, string> = {
  contains: 'contains',
  beginsWith: 'begins_with',
  type: 'attribute_type'
}

const conditionType = writable([
  'S',
  'SS',
  'N',
  'NS',
  'B',
  'BS',
  'BOOL',
  'NULL',
  'L',
  'M'
] as const) satisfies ConditionType[]

type TwoArgsFnConditionParser = <CONDITION extends TwoArgsFnCondition>(
  conditionParser: ConditionParser,
  condition: CONDITION
) => void

export const parseTwoArgsFnCondition: TwoArgsFnConditionParser = <
  CONDITION extends TwoArgsFnCondition
>(
  conditionParser: ConditionParser,
  condition: CONDITION
): void => {
  const comparisonOperator = Object.keys(condition).find(isTwoArgsFnOperator) as keyof CONDITION &
    TwoArgsFnOperator

  const attributePath = condition.attr
  const expressionAttributeValue = condition[comparisonOperator]
  const { transform = true } = condition as { transform?: boolean }

  conditionParser.resetExpression(`${twoArgsFnOperatorExpression[comparisonOperator]}(`)
  const attribute = conditionParser.appendAttributePath(attributePath)
  conditionParser.appendToExpression(', ')

  let targetAttribute: AttrSchema
  switch (comparisonOperator) {
    case 'type':
      targetAttribute = new StringSchema({ enum: conditionType })
      break
    case 'contains':
      switch (attribute.type) {
        case 'set':
        case 'list':
          targetAttribute = attribute.elements
          break
        case 'string':
          // We accept any string in case of contains
          targetAttribute = new StringSchema({})
          break
        default:
          targetAttribute = attribute
      }
      break
    default:
      targetAttribute = attribute
  }

  comparisonOperator === 'type'
    ? conditionParser.appendAttributeValue(targetAttribute, expressionAttributeValue)
    : conditionParser.appendAttributeValueOrPath(targetAttribute, expressionAttributeValue, {
        transform
      })
  conditionParser.appendToExpression(')')
}
