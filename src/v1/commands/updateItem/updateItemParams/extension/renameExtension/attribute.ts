import type { ExtensionRenamer } from 'v1/validation/renameSavedAsAttributes/types'
import { renameAttributeSavedAsAttributes } from 'v1/validation/renameSavedAsAttributes'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import {
  $SET,
  $REMOVE,
  $SUM,
  $SUBTRACT,
  $ADD,
  $DELETE,
  $APPEND,
  $PREPEND
} from 'v1/commands/updateItem/constants'
import {
  hasSetOperation,
  hasGetOperation,
  hasSumOperation,
  hasSubtractOperation,
  hasAddOperation,
  hasDeleteOperation,
  hasAppendOperation,
  hasPrependOperation
} from 'v1/commands/updateItem/utils'

import { renameReferenceExtension } from './reference'

export const renameUpdateExtension: ExtensionRenamer<UpdateItemInputExtension> = (
  input,
  options
) => {
  if (input === $REMOVE) {
    return {
      isExtension: true,
      renamedExtension: $REMOVE
    }
  }

  if (hasSetOperation(input)) {
    // Omit parseExtension as $set means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { renameExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      renamedExtension: renameAttributeSavedAsAttributes<never>(input[$SET], restOptions)
    }
  }

  if (hasGetOperation(input)) {
    return renameReferenceExtension(input, {
      ...options,
      renameExtension: renameReferenceExtension
    })
  }

  if (hasSumOperation(input)) {
    return {
      isExtension: true,
      renamedExtension: {
        [$SUM]: input[$SUM].map(element =>
          renameAttributeSavedAsAttributes<ReferenceExtension>(element, {
            ...options,
            renameExtension: renameReferenceExtension
          })
        )
      }
    }
  }

  if (hasSubtractOperation(input)) {
    return {
      isExtension: true,
      renamedExtension: {
        [$SUBTRACT]: input[$SUBTRACT].map(element =>
          renameAttributeSavedAsAttributes<ReferenceExtension>(element, {
            ...options,
            renameExtension: renameReferenceExtension
          })
        )
      }
    }
  }

  if (hasAddOperation<ReferenceExtension>(input)) {
    return {
      isExtension: true,
      renamedExtension: {
        [$ADD]: renameAttributeSavedAsAttributes<ReferenceExtension>(input[$ADD], {
          ...options,
          renameExtension: renameReferenceExtension
        })
      }
    }
  }

  if (hasDeleteOperation(input)) {
    // Omit parseExtension as $delete means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { renameExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      renamedExtension: {
        [$DELETE]: renameAttributeSavedAsAttributes<never>(input[$DELETE], restOptions)
      }
    }
  }

  if (hasAppendOperation(input)) {
    return {
      isExtension: true,
      renamedExtension: {
        [$APPEND]: renameAttributeSavedAsAttributes<ReferenceExtension>(input[$APPEND], {
          ...options,
          renameExtension: renameReferenceExtension
        })
      }
    }
  }

  if (hasPrependOperation(input)) {
    return {
      isExtension: true,
      renamedExtension: {
        [$PREPEND]: renameAttributeSavedAsAttributes<ReferenceExtension>(input[$PREPEND], {
          ...options,
          renameExtension: renameReferenceExtension
        })
      }
    }
  }

  return { isExtension: false, basicInput: input }
}
