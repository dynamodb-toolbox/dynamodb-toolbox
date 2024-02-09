import { DynamoDBToolboxError } from 'v1/errors'
import type { ComputeObject } from 'v1/types'

import type { FreezeAttribute } from '../types'
import { validateAttributeProperties } from '../shared/validate'
import { hasDefinedDefault } from '../shared/hasDefinedDefault'
import {
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions'

import type { SharedAttributeState } from '../shared/interface'
import type { $SetAttributeState, MegaSetAttribute } from './interface'
import type { $SetAttributeElements } from './types'

export type FreezeSetAttribute<$SET_ATTRIBUTE extends $SetAttributeState> = ComputeObject<
  MegaSetAttribute<
    FreezeAttribute<$SET_ATTRIBUTE[$elements]>,
    {
      required: $SET_ATTRIBUTE[$required]
      hidden: $SET_ATTRIBUTE[$hidden]
      key: $SET_ATTRIBUTE[$key]
      savedAs: $SET_ATTRIBUTE[$savedAs]
      defaults: $SET_ATTRIBUTE[$defaults]
      links: $SET_ATTRIBUTE[$links]
    }
  >
>

type SetAttributeFreezer = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeState
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
  STATE extends SharedAttributeState
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
      message: `Invalid set elements at path ${path}: Set elements cannot have default or linked values`,
      path
    })
  }

  const frozenElements = elements.freeze(`${path}[x]`) as FreezeAttribute<$ELEMENTS>

  return {
    path,
    type: 'set',
    elements: frozenElements,
    // TODO
    parse: input => input as any,
    ...state
  }
}
