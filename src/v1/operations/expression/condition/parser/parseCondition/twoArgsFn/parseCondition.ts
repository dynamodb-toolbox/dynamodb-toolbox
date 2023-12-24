import { Always, PrimitiveAttribute } from 'v1/schema'

import type { ConditionParser } from '../../parser'
import { TwoArgsFnOperator, isTwoArgsFnOperator, TwoArgsFnCondition } from './types'

const twoArgsFnOperatorExpression: Record<TwoArgsFnOperator, string> = {
  contains: 'contains',
  beginsWith: 'begins_with',
  type: 'attribute_type'
}

const typeAttribute: PrimitiveAttribute<
  'string',
  {
    required: Always
    hidden: false
    key: false
    savedAs: undefined
    enum: ['S', 'SS', 'N', 'NS', 'B', 'BS', 'BOOL', 'NULL', 'L', 'M']
    defaults: {
      key: undefined
      put: undefined
      update: undefined
    }
    transform: undefined
  }
> = {
  path: '',
  type: 'string',
  required: 'always',
  hidden: false,
  key: false,
  savedAs: undefined,
  enum: ['S', 'SS', 'N', 'NS', 'B', 'BS', 'BOOL', 'NULL', 'L', 'M'],
  defaults: {
    key: undefined,
    put: undefined,
    update: undefined
  },
  transform: undefined
}

export const parseTwoArgsFnCondition = <CONDITION extends TwoArgsFnCondition>(
  conditionParser: ConditionParser,
  condition: CONDITION
): void => {
  const comparisonOperator = Object.keys(condition).find(isTwoArgsFnOperator) as keyof CONDITION &
    TwoArgsFnOperator

  // TOIMPROVE: It doesn't make sense to use size in two args fns
  const attributePath = condition.size ?? condition.attr
  const expressionAttributeValue = condition[comparisonOperator]

  conditionParser.resetExpression(`${twoArgsFnOperatorExpression[comparisonOperator]}(`)
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(', ')
  comparisonOperator === 'type'
    ? conditionParser.appendAttributeValue(
        { ...typeAttribute, path: attributePath },
        expressionAttributeValue
      )
    : conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue)
  conditionParser.appendToExpression(')')
}
