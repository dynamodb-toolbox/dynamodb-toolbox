import { $SET } from '~/entity/actions/update/symbols/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  SchemaUnextendedValue,
  TupleSchema
} from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { UpdateAttributesInputExtension } from '../../types.js'

export const parseTupleExtension = (
  schema: TupleSchema,
  input: unknown,
  { transform = true, valuePath }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateAttributesInputExtension>> => {
  if (isArray(input)) {
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
