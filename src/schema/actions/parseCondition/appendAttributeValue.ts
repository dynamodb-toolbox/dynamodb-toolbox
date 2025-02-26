import type { AttrSchema } from '~/attributes/index.js'
import { Parser } from '~/schema/actions/parse/index.js'

import type { ConditionParser } from './conditionParser.js'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: AttrSchema,
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
