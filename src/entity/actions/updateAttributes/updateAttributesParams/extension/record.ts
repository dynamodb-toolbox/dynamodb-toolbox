import type { AttributeBasicValue, RecordAttribute } from '~/attributes/index.js'
import { $SET } from '~/entity/actions/update/symbols/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { UpdateAttributesInputExtension } from '../../types.js'

export const parseRecordExtension = (
  attribute: RecordAttribute,
  input: unknown,
  options: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateAttributesInputExtension>> => {
  const { transform = true } = options

  if (isObject(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input, { fill: false, transform })

        const parsedValue = { [$SET]: parser.next().value }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateAttributesInputExtension> | undefined
  }
}
