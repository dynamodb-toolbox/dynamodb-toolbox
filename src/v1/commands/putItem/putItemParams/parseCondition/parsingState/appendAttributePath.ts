import type { Attribute } from 'v1/item'
import { isObject } from 'v1/utils/validation/isObject'
import { isString } from 'v1/utils/validation/isString'

import { ConditionParsingState } from './conditionParsingState'

export const isAttributePath = (candidate: unknown): candidate is { attr: string } =>
  isObject(candidate) && 'attr' in candidate && isString(candidate.attr)

export const appendAttributePath = (
  state: ConditionParsingState,
  attributePath: string,
  options: { size?: boolean } = {}
): Attribute => {
  const pathMatches = attributePath.matchAll(/\w+(?=(\.|$|((\[\d+\])+)))/g)

  for (const pathMatch of pathMatches) {
    const [expressionAttributeName, followingSeparator] = pathMatch

    const expressionAttributeNameIndex = state.expressionAttributeNames.push(
      expressionAttributeName
    )

    const conditionExpressionPath = `#${expressionAttributeNameIndex}${followingSeparator}`

    state.conditionExpression += options.size
      ? `size(${conditionExpressionPath})`
      : conditionExpressionPath
  }

  return {} as Attribute
}
