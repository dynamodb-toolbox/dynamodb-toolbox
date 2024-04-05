import type { Attribute } from 'v1/schema/attributes'
import { Parser } from 'v1/schema/actions/parse'

import type { ConditionParser } from './conditionParser'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown,
  options: AppendAttributeValueOptions = {}
): void => {
  const { transform = false } = options

  const parsed = new Parser(attribute).parse(expressionAttributeValue, {
    fill: false,
    transform
  })

  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(parsed)

  conditionParser.appendToExpression(
    `:${conditionParser.expressionAttributePrefix}${expressionAttributeValueIndex}`
  )
}
