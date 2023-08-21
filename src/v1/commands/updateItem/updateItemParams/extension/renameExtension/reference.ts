import type { ExtensionRenamer } from 'v1/validation/renameSavedAsAttributes/types'
import type { ReferenceExtension } from 'v1/commands/types'
import type { AttributeValue } from 'v1/schema'
import { $GET } from 'v1/commands/updateItem/constants'
import { renameAttributeSavedAsAttributes } from 'v1/validation/renameSavedAsAttributes/attribute'

import { hasGetOperation } from '../utils'

export const renameReferenceExtension: ExtensionRenamer<ReferenceExtension> = (input, options) => {
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
    renamedExtension: {
      [$GET]: [
        reference,
        ...(fallback !== undefined
          ? [renameAttributeSavedAsAttributes<ReferenceExtension>(fallback, options)]
          : [])
      ]
    }
  }
}
