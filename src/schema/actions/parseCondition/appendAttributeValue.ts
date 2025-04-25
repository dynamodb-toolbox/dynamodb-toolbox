import { Parser } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'

import type { ConditionParser } from './conditionParser.js'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  parser: ConditionParser,
  schema: Schema,
  expressionAttributeValue: unknown,
  options: AppendAttributeValueOptions = {}
): void => {
  const { transform = false } = options

  const parsed = new Parser(schema).parse(expressionAttributeValue, {
    fill: false,
    transform
  })

  const expressionAttributeValueIndex = parser.expressionAttributeValues.push(parsed)

  parser.appendToExpression(`:${parser.expressionTokenPrefix}${expressionAttributeValueIndex}`)
}
