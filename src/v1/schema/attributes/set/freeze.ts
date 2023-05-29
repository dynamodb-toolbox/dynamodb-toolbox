import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { freezeAttribute, FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'

import type { $SetAttribute, SetAttribute } from './interface'

export type FreezeSetAttribute<$SET_ATTRIBUTE extends $SetAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    SetAttribute<
      FreezeAttribute<$SET_ATTRIBUTE[$elements]>,
      {
        required: $SET_ATTRIBUTE[$required]
        hidden: $SET_ATTRIBUTE[$hidden]
        key: $SET_ATTRIBUTE[$key]
        savedAs: $SET_ATTRIBUTE[$savedAs]
        default: $SET_ATTRIBUTE[$default]
      }
    >,
    never,
    never
  >

type SetAttributeFreezer = <$SET_ATTRIBUTE extends $SetAttribute>(
  $setAttribute: $SET_ATTRIBUTE,
  path: string
) => FreezeSetAttribute<$SET_ATTRIBUTE>

/**
 * Validates a set instance
 *
 * @param $setAttribute SetAttribute
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeSetAttribute: SetAttributeFreezer = <$SET_ATTRIBUTE extends $SetAttribute>(
  $setAttribute: $SET_ATTRIBUTE,
  path: string
): FreezeSetAttribute<$SET_ATTRIBUTE> => {
  validateAttributeProperties($setAttribute, path)

  const elements: $SET_ATTRIBUTE[$elements] = $setAttribute[$elements]

  if (elements[$required] !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('schema.setAttribute.optionalElements', {
      message: `Invalid set elements at path ${path}: Set elements must be required`,
      path
    })
  }

  if (elements[$hidden] !== false) {
    throw new DynamoDBToolboxError('schema.setAttribute.hiddenElements', {
      message: `Invalid set elements at path ${path}: Set elements cannot be hidden`,
      path
    })
  }

  if (elements[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('schema.setAttribute.savedAsElements', {
      message: `Invalid set elements at path ${path}: Set elements cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (elements[$default] !== undefined) {
    throw new DynamoDBToolboxError('schema.setAttribute.defaultedElements', {
      message: `Invalid set elements at path ${path}: Set elements cannot have default values`,
      path
    })
  }

  const frozenElements = freezeAttribute(elements, `${path}[x]`)

  return {
    path,
    type: $setAttribute[$type],
    elements: frozenElements,
    required: $setAttribute[$required],
    hidden: $setAttribute[$hidden],
    key: $setAttribute[$key],
    savedAs: $setAttribute[$savedAs],
    default: $setAttribute[$default]
  }
}
