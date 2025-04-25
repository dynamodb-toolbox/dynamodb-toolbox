import type { AppendAttributePathOptions } from '~/schema/actions/utils/expressionParser.js'
import type { Schema } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'
import { isString } from '~/utils/validation/isString.js'

import type { AppendAttributeValueOptions } from './appendAttributeValue.js'
import type { ConditionParser } from './conditionParser.js'

const isAttributePath = (valueOrPath: unknown): valueOrPath is { attr: string } =>
  isObject(valueOrPath) && 'attr' in valueOrPath && isString(valueOrPath.attr)

export const appendAttributeValueOrPath = (
  parser: ConditionParser,
  schema: Schema,
  expressionAttributeValueOrPath: unknown,
  options: AppendAttributeValueOptions & AppendAttributePathOptions = {}
): void => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    parser.appendAttributePath(expressionAttributeValueOrPath.attr, options)
  } else {
    parser.appendAttributeValue(schema, expressionAttributeValueOrPath, options)
  }
}
