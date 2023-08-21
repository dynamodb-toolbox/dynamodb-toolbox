import type { Item, Extension } from 'v1/schema'
import type { If } from 'v1/types'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import type { ParsedItem, HasExtension } from '../types'
import type { RenamingOptions } from './types'
import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = <EXTENSION extends Extension = never>(
  schemaInput: ParsedItem<EXTENSION>,
  ...[renamingOptions = {} as RenamingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: RenamingOptions<EXTENSION>],
    [options?: RenamingOptions<EXTENSION>]
  >
): Item<EXTENSION> => {
  const renamedInput: Item<EXTENSION> = {}

  Object.entries(schemaInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput, renamingOptions)
    renamedInput[schemaInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
