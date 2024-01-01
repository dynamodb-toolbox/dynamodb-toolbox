import type { ExtensionCollapser } from 'v1/validation/collapseParsedInput/types'
import type { ReferenceExtension } from 'v1/operations/types'
import type { AttributeValue } from 'v1/schema'
import { collapseAttributeParsedInput } from 'v1/validation/collapseParsedInput/attribute'

import { $GET } from 'v1/operations/updateItem/constants'
import { hasGetOperation } from 'v1/operations/updateItem/utils'

export const collapseReferenceExtension: ExtensionCollapser<ReferenceExtension> = (
  attribute,
  input,
  options
) => {
  if (!hasGetOperation(input)) {
    return {
      isExtension: false,
      basicInput: input
    }
  }

  const [reference, fallback] = input[$GET] as [
    reference: AttributeValue<ReferenceExtension>,
    fallback?: AttributeValue<ReferenceExtension>
  ]

  return {
    isExtension: true,
    collapsedExtension: {
      [$GET]: [
        reference,
        ...(fallback !== undefined
          ? [collapseAttributeParsedInput<ReferenceExtension>(attribute, fallback, options)]
          : [])
      ]
    }
  }
}
