import type { AttributeValue } from 'v1/schema'
import type { ExtensionRenamer } from 'v1/validation/renameSavedAsAttributes/types'
import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { renameAttributeSavedAsAttributes } from 'v1/validation/renameSavedAsAttributes'
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
} from '../utils'
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
    const renamedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(renamedExtension, {
      [$SUM]: input[$SUM].map(element =>
        renameAttributeSavedAsAttributes<ReferenceExtension>(element, {
          ...options,
          renameExtension: renameReferenceExtension
        })
      )
    })

    return {
      isExtension: true,
      renamedExtension
    }
  }

  if (hasSubtractOperation(input)) {
    const renamedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(renamedExtension, {
      [$SUBTRACT]: input[$SUBTRACT].map(element =>
        renameAttributeSavedAsAttributes<ReferenceExtension>(element, {
          ...options,
          renameExtension: renameReferenceExtension
        })
      )
    })

    return {
      isExtension: true,
      renamedExtension
    }
  }

  if (hasAddOperation<ReferenceExtension>(input)) {
    const renamedExtension: AttributeValue<UpdateItemInputExtension> = {}

    Object.assign(renamedExtension, {
      [$ADD]: renameAttributeSavedAsAttributes<ReferenceExtension>(input[$ADD], {
        ...options,
        renameExtension: renameReferenceExtension
      })
    })

    return {
      isExtension: true,
      renamedExtension
    }
  }

  if (hasDeleteOperation(input)) {
    // Omit parseExtension as $delete means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { renameExtension: _, ...restOptions } = options

    const renamedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(renamedExtension, {
      [$DELETE]: renameAttributeSavedAsAttributes(input[$DELETE], restOptions)
    })

    return {
      isExtension: true,
      renamedExtension
    }
  }

  if (hasAppendOperation(input)) {
    const renamedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(renamedExtension, {
      [$APPEND]: renameAttributeSavedAsAttributes<ReferenceExtension>(input[$APPEND], {
        ...options,
        renameExtension: renameReferenceExtension
      })
    })

    return {
      isExtension: true,
      renamedExtension
    }
  }

  if (hasPrependOperation(input)) {
    const renamedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(renamedExtension, {
      [$PREPEND]: renameAttributeSavedAsAttributes<ReferenceExtension>(input[$PREPEND], {
        ...options,
        renameExtension: renameReferenceExtension
      })
    })

    return {
      isExtension: true,
      renamedExtension
    }
  }

  return { isExtension: false, basicInput: input }
}
