import type { ExtensionCollapser } from 'v1/validation/collapseParsedInput/types'
import { collapseAttributeParsedInput } from 'v1/validation/collapseParsedInput'

import type { AttributeValue } from 'v1/schema'
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
import { isObject } from 'v1/utils/validation/isObject'

import { collapseReferenceExtension } from './reference'

export const collapseUpdateExtension: ExtensionCollapser<UpdateItemInputExtension> = (
  attribute,
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
        [$SET]: collapseAttributeParsedInput<never>(attribute, input[$SET], restOptions)
      }
    }
  }

  if (hasGetOperation(input)) {
    return collapseReferenceExtension(attribute, input, {
      ...options,
      collapseExtension: collapseReferenceExtension
    })
  }

  if (hasSumOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$SUM]: input[$SUM].map(element =>
          collapseAttributeParsedInput<ReferenceExtension>(attribute, element, {
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
          collapseAttributeParsedInput<ReferenceExtension>(attribute, element, {
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
        [$ADD]: collapseAttributeParsedInput<ReferenceExtension>(attribute, input[$ADD], {
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
        [$DELETE]: collapseAttributeParsedInput<never>(attribute, input[$DELETE], restOptions)
      }
    }
  }

  if (hasAppendOperation(input)) {
    return {
      isExtension: true,
      collapsedExtension: {
        [$APPEND]: collapseAttributeParsedInput<ReferenceExtension>(attribute, input[$APPEND], {
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
        [$PREPEND]: collapseAttributeParsedInput<ReferenceExtension>(attribute, input[$PREPEND], {
          ...options,
          collapseExtension: collapseReferenceExtension
        })
      }
    }
  }

  if (attribute.type === 'list' && isObject(input)) {
    const maxUpdatedIndex = Math.max(...Object.keys(input).map(parseFloat))

    return {
      isExtension: true,
      collapsedExtension: [...Array(maxUpdatedIndex + 1).keys()].map(index => {
        // @ts-expect-error we dont care for now
        const elementInput = input[index] as AttributeValue<UpdateItemInputExtension> | undefined

        return elementInput === undefined
          ? undefined
          : // @ts-expect-error
            collapseAttributeParsedInput(attribute.elements, input[index], options)
      })
    }
  }

  return { isExtension: false, basicInput: input }
}
