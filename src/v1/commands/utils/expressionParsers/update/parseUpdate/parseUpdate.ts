import type { UpdateItemInput, UpdateAttributeInput } from 'v1/commands/updateItem/types'
import { hasDeleteOperation } from 'v1/commands/updateItem/updateItemParams/extension/utils'
import { $DELETE } from 'v1/commands/updateItem/constants'
import { isObject } from 'v1/utils/validation'

import type { UpdateParser } from '../updateParser'

export const parseUpdate = (
  parser: UpdateParser,
  input: UpdateItemInput | UpdateAttributeInput,
  currentPath: (string | number)[] = []
): void => {
  if (hasDeleteOperation(input)) {
    parser.delete.appendValidAttributePath(currentPath)
    parser.delete.appendToExpression(' ')
    parser.delete.appendValidAttributeValue(input[$DELETE])
  }

  if (isObject(input)) {
    for (const [key, value] of Object.entries(input)) {
      parser.parseUpdate(value, [...currentPath, key])
    }
  }
}
