import type { AttributeBasicValue, MapSchema } from '~/attributes/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'

import { $SET, isSetting } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'

export const parseMapExtension = (
  attribute: MapSchema,
  input: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSetting(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input[$SET], {
          fill: false,
          transform,
          valuePath: [...valuePath, '$SET']
        })

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
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
