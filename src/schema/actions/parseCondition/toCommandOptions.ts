import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { isString } from '~/utils/validation/isString.js'

import type { ConditionParser } from './conditionParser.js'

/**
 * @debt refactor "factorize with other expressions"
 */
export const toCommandOptions = (
  conditionParser: ConditionParser
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => {
  const ExpressionAttributeNames: Record<string, string> = {}

  const stringTokens: Record<symbol, string> = {}
  let cursor = 1
  let ConditionExpression = ''

  for (const expressionPart of conditionParser.expression) {
    if (isString(expressionPart)) {
      ConditionExpression += expressionPart
      continue
    }

    let stringToken = stringTokens[expressionPart]

    if (stringToken === undefined) {
      stringToken = `#${conditionParser.expressionAttributePrefix}${cursor}`
      ExpressionAttributeNames[stringToken] =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        conditionParser.expressionAttributeNames[expressionPart]!
      stringTokens[expressionPart] = stringToken
      cursor++
    }

    ConditionExpression += stringToken
  }

  const ExpressionAttributeValues: Record<string, NativeAttributeValue> = {}
  conditionParser.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    ExpressionAttributeValues[`:${conditionParser.expressionAttributePrefix}${index + 1}`] =
      expressionAttributeValue
  })

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  }
}
