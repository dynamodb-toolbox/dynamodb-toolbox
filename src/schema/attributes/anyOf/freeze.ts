import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import {
  $defaults,
  $elements,
  $hidden,
  $key,
  $links,
  $required,
  $savedAs
} from '../constants/attributeOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $AttributeState } from '../types/index.js'
import { $AnyOfAttributeState, AnyOfAttribute } from './interface.js'
import type { $AnyOfAttributeElements, AnyOfAttributeElements } from './types.js'

type FreezeElements<
  $ELEMENTS extends $AnyOfAttributeElements[],
  RESULTS extends AnyOfAttributeElements[] = []
> = $AnyOfAttributeElements[] extends $ELEMENTS
  ? AnyOfAttributeElements[]
  : $ELEMENTS extends [infer $ELEMENTS_HEAD, ...infer $ELEMENTS_TAIL]
  ? $ELEMENTS_TAIL extends $AnyOfAttributeElements[]
    ? $ELEMENTS_HEAD extends $AttributeState
      ? FreezeAttribute<$ELEMENTS_HEAD> extends AnyOfAttributeElements
        ? FreezeElements<$ELEMENTS_TAIL, [...RESULTS, FreezeAttribute<$ELEMENTS_HEAD>]>
        : FreezeElements<$ELEMENTS_TAIL, RESULTS>
      : FreezeElements<$ELEMENTS_TAIL, RESULTS>
    : never
  : RESULTS

export type FreezeAnyOfAttribute<$ANY_OF_ATTRIBUTE extends $AnyOfAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    AnyOfAttribute<
      FreezeElements<$ANY_OF_ATTRIBUTE[$elements]>,
      {
        required: $ANY_OF_ATTRIBUTE[$required]
        hidden: $ANY_OF_ATTRIBUTE[$hidden]
        key: $ANY_OF_ATTRIBUTE[$key]
        savedAs: $ANY_OF_ATTRIBUTE[$savedAs]
        defaults: $ANY_OF_ATTRIBUTE[$defaults]
        links: $ANY_OF_ATTRIBUTE[$links]
      }
    >,
    never,
    never
  >

type AnyOfAttributeFreezer = <
  $ELEMENTS extends $AnyOfAttributeElements[],
  STATE extends SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE,
  path?: string
) => FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>

/**
 * Freezes a warm `anyOf` attribute
 *
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyOfAttribute: AnyOfAttributeFreezer = <
  $ELEMENTS extends $AnyOfAttributeElements[],
  STATE extends SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE,
  path?: string
): FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>> => {
  validateAttributeProperties(state, path)

  if (!isArray(elements)) {
    throw new DynamoDBToolboxError('schema.anyOfAttribute.invalidElements', {
      message: `Invalid anyOf elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: AnyOf elements must be an array.`,
      path
    })
  }

  if (elements.length === 0) {
    throw new DynamoDBToolboxError('schema.anyOfAttribute.missingElements', {
      message: `Invalid anyOf elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: AnyOf attributes must have at least one element.`,
      path
    })
  }

  elements.forEach(element => {
    if (element[$required] !== 'atLeastOnce' && element[$required] !== 'always') {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.optionalElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements must be required.`,
        path
      })
    }

    if (element[$hidden] !== false) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.hiddenElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements cannot be hidden.`,
        path
      })
    }

    if (element[$savedAs] !== undefined) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.savedAsElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(element)) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.defaultedElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements cannot have default or linked values.`,
        path
      })
    }
  })

  const frozenElements = elements.map(element => element.freeze(path)) as FreezeElements<$ELEMENTS>

  return new AnyOfAttribute({
    path,
    elements: frozenElements,
    ...state
  })
}
