import type { Attribute } from 'v1/schema/attributes/index.js'
import { PrimitiveAttribute, string } from 'v1/schema/attributes/primitive/index.js'

import type { ConditionParser } from '../../conditionParser.js'
import { TwoArgsFnOperator, isTwoArgsFnOperator, TwoArgsFnCondition } from './types.js'

const twoArgsFnOperatorExpression: Record<TwoArgsFnOperator, string> = {
  contains: 'contains',
  beginsWith: 'begins_with',
  type: 'attribute_type'
}

const stringAttribute = string().freeze()

const typeAttribute = string()
  .enum('S', 'SS', 'N', 'NS', 'B', 'BS', 'BOOL', 'NULL', 'L', 'M')
  .freeze()

export const parseTwoArgsFnCondition = <CONDITION extends TwoArgsFnCondition>(
  conditionParser: ConditionParser,
  condition: CONDITION
): void => {
  const comparisonOperator = Object.keys(condition).find(isTwoArgsFnOperator) as keyof CONDITION &
    TwoArgsFnOperator

  // TOIMPROVE: It doesn't make sense to use size in two args fns
  const attributePath = condition.size ?? condition.attr
  const expressionAttributeValue = condition[comparisonOperator]
  const { transform = true } = condition as { transform?: boolean }

  conditionParser.resetExpression(`${twoArgsFnOperatorExpression[comparisonOperator]}(`)
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(', ')

  let targetAttribute: Attribute
  switch (comparisonOperator) {
    case 'type':
      targetAttribute = new PrimitiveAttribute({ ...typeAttribute, path: attributePath })
      break
    case 'contains':
      switch (attribute.type) {
        case 'set':
        case 'list':
          targetAttribute = attribute.elements
          break
        case 'string':
          // We accept any string in case of contains
          targetAttribute = new PrimitiveAttribute({ ...stringAttribute, path: attributePath })
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
