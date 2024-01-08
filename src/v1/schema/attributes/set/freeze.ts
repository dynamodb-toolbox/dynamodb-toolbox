import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import type { FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import { hasDefinedDefault } from '../shared/hasDefinedDefault'
import {
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import type { SharedAttributeStateConstraint } from '../shared/interface'
import type { $SetAttributeState, SetAttribute } from './interface'
import type { $SetAttributeElements } from './types'

export type FreezeSetAttribute<$SET_ATTRIBUTE extends $SetAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    SetAttribute<
      FreezeAttribute<$SET_ATTRIBUTE[$elements]>,
      {
        required: $SET_ATTRIBUTE[$required]
        hidden: $SET_ATTRIBUTE[$hidden]
        key: $SET_ATTRIBUTE[$key]
        savedAs: $SET_ATTRIBUTE[$savedAs]
        defaults: $SET_ATTRIBUTE[$defaults]
      }
    >,
    never,
    never
  >

type SetAttributeFreezer = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeStateConstraint
>(
  $elements: $ELEMENTS,
  state: STATE,
  path: string
) => FreezeSetAttribute<$SetAttributeState<$ELEMENTS, STATE>>

/**
 * Validates a set instance
 *
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeSetAttribute: SetAttributeFreezer = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeStateConstraint
>(
  elements: $ELEMENTS,
  state: STATE,
  path: string
): FreezeSetAttribute<$SetAttributeState<$ELEMENTS, STATE>> => {
  validateAttributeProperties(state, path)

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

  if (hasDefinedDefault(elements)) {
    throw new DynamoDBToolboxError('schema.setAttribute.defaultedElements', {
      message: `Invalid set elements at path ${path}: Set elements cannot have default values`,
      path
    })
  }

  const frozenElements = elements.freeze(`${path}[x]`) as FreezeAttribute<$ELEMENTS>

  return {
    path,
    type: 'set',
    elements: frozenElements,
    ...state
  }
}
