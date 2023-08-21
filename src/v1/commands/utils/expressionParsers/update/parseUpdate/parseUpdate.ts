import type { UpdateItemInput, UpdateAttributeInput } from 'v1/commands/updateItem/types'
import {
  hasAddOperation,
  hasDeleteOperation
} from 'v1/commands/updateItem/updateItemParams/extension/utils'
import { $REMOVE, $ADD, $DELETE } from 'v1/commands/updateItem/constants'
import { isObject } from 'v1/utils/validation/isObject'
import { isArray } from 'v1/utils/validation/isArray'

import type { UpdateParser } from '../updateParser'

export const parseUpdate = (
  parser: UpdateParser,
  input: UpdateItemInput | UpdateAttributeInput,
  currentPath: (string | number)[] = []
): void => {
  if (input === $REMOVE) {
    parser.remove.appendValidAttributePath(currentPath)
  }

  if (hasAddOperation(input)) {
    parser.add.appendValidAttributePath(currentPath)
    parser.add.appendToExpression(' ')
    parser.add.appendValidAttributeValue(input[$ADD])
  }

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

  if (isArray(input)) {
    input.forEach((element, index) => {
      parser.parseUpdate(element, [...currentPath, index])
    })
  }
}
