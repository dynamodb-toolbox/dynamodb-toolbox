import cloneDeep from 'lodash.clonedeep'

import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import type { ReferenceExtension } from 'v1/commands/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { $GET } from 'v1/commands/updateItem/constants'
import { isArray } from 'v1/utils/validation/isArray'

import { hasGetOperation } from '../utils'

export const cloneReferenceExtension: ExtensionCloner<ReferenceExtension> = (
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

  if (!isArray(input[$GET])) {
    return {
      isExtension: true,
      clonedExtension: { [$GET]: cloneDeep(input[$GET]) }
    }
  }

  const [reference, fallback] = input[$GET]

  return {
    isExtension: true,
    clonedExtension: {
      [$GET]: [
        reference,
        ...(fallback !== undefined
          ? [cloneAttributeInputAndAddDefaults(attribute, fallback, options)]
          : [])
      ]
    }
  }
}
