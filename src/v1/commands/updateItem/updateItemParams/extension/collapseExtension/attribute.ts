import type { ExtensionCollapser } from 'v1/validation/collapseParsedInput/types'
import { collapseAttributeParsedInput } from 'v1/validation/collapseParsedInput'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import {
  $SET,
  $REMOVE,
  $SUM,
  $SUBTRACT,
  $ADD,
  $DELETE,
  $APPEND,
  $PREPEND
} from 'v1/operations/updateItem/constants'
import {
  hasSetOperation,
  hasGetOperation,
  hasSumOperation,
  hasSubtractOperation,
  hasAddOperation,
  hasDeleteOperation,
  hasAppendOperation,
  hasPrependOperation
} from 'v1/operations/updateItem/utils'

import { collapseReferenceExtension } from './reference'

export const collapseUpdateExtension: ExtensionCollapser<UpdateItemInputExtension> = (
  input,
  options
) => {
  if (input === $REMOVE) {
    return {
      isExtension: true,
      collapsedExtension: $REMOVE
    }
  }

  if (hasSetOperation(input)) {
    // Omit collapseExtension for non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { collapseExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      collapsedExtension: {
        [$SET]: collapseAttributeParsedInput<never>(input[$SET], restOptions)
      }
    }
  }

  if (hasGetOperation(input)) {
    return collapseReferenceExtension(input, {
      ...options,
      collapseExtension: collapseReferenceExtension
    })
  }

  if (hasSumOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$SUM]: input[$SUM].map(element =>
          collapseAttributeParsedInput<ReferenceExtension>(element, {
            ...options,
            collapseExtension: collapseReferenceExtension
          })
        )
      }
    }
  }

  if (hasSubtractOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$SUBTRACT]: input[$SUBTRACT].map(element =>
          collapseAttributeParsedInput<ReferenceExtension>(element, {
            ...options,
            collapseExtension: collapseReferenceExtension
          })
        )
      }
    }
  }

  if (hasAddOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$ADD]: collapseAttributeParsedInput<ReferenceExtension>(input[$ADD], {
          ...options,
          collapseExtension: collapseReferenceExtension
        })
      }
    }
  }

  if (hasDeleteOperation(input)) {
    // Omit collapseExtension for non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { collapseExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      collapsedExtension: {
        [$DELETE]: collapseAttributeParsedInput<never>(input[$DELETE], restOptions)
      }
    }
  }

  if (hasAppendOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$APPEND]: collapseAttributeParsedInput<ReferenceExtension>(input[$APPEND], {
          ...options,
          collapseExtension: collapseReferenceExtension
        })
      }
    }
  }

  if (hasPrependOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$PREPEND]: collapseAttributeParsedInput<ReferenceExtension>(input[$PREPEND], {
          ...options,
          collapseExtension: collapseReferenceExtension
        })
      }
    }
  }

  return { isExtension: false, basicInput: input }
}
