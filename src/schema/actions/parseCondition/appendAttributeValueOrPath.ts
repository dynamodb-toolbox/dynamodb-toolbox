import type { Attribute } from '~/attributes/index.js'
import type { AppendAttributePathOptions } from '~/schema/actions/utils/appendAttributePath.js'
import { isObject } from '~/utils/validation/isObject.js'
import { isString } from '~/utils/validation/isString.js'

import type { AppendAttributeValueOptions } from './appendAttributeValue.js'
import type { ConditionParser } from './conditionParser.js'

const isAttributePath = (valueOrPath: unknown): valueOrPath is { attr: string } =>
  isObject(valueOrPath) && 'attr' in valueOrPath && isString(valueOrPath.attr)

export const appendAttributeValueOrPath = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValueOrPath: unknown,
  options: AppendAttributeValueOptions & AppendAttributePathOptions = {}
): void => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    conditionParser.appendAttributePath(expressionAttributeValueOrPath.attr, options)
  } else {
    conditionParser.appendAttributeValue(attribute, expressionAttributeValueOrPath, options)
  }
}
