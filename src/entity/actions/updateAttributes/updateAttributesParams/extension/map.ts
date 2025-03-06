import { $SET } from '~/entity/actions/update/symbols/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  MapSchema,
  SchemaUnextendedValue
} from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { UpdateAttributesInputExtension } from '../../types.js'

export const parseMapExtension = (
  schema: MapSchema,
  input: unknown,
  { transform = true, valuePath }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateAttributesInputExtension>> => {
  if (isObject(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(schema).start(input, { fill: false, transform, valuePath })

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
    unextendedInput: input as SchemaUnextendedValue<UpdateAttributesInputExtension> | undefined
  }
}
