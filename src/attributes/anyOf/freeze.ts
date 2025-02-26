import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { FreezeAttribute } from '../freeze.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { AttrSchema } from '../types/index.js'
import type { AnyOfAttribute, AnyOfSchema } from './interface.js'
import { AnyOfAttribute_ } from './interface.js'
import type { $AnyOfAttributeElements, AnyOfAttributeElements } from './types.js'

type FreezeElements<
  $ELEMENTS extends $AnyOfAttributeElements[],
  RESULTS extends AnyOfAttributeElements[] = []
> = $AnyOfAttributeElements[] extends $ELEMENTS
  ? AnyOfAttributeElements[]
  : $ELEMENTS extends [infer $ELEMENTS_HEAD, ...infer $ELEMENTS_TAIL]
    ? $ELEMENTS_TAIL extends $AnyOfAttributeElements[]
      ? $ELEMENTS_HEAD extends AttrSchema
        ? FreezeAttribute<$ELEMENTS_HEAD, false> extends AnyOfAttributeElements
          ? FreezeElements<$ELEMENTS_TAIL, [...RESULTS, FreezeAttribute<$ELEMENTS_HEAD, false>]>
          : FreezeElements<$ELEMENTS_TAIL, RESULTS>
        : FreezeElements<$ELEMENTS_TAIL, RESULTS>
      : never
    : RESULTS

export type FreezeAnyOfAttribute<
  $ANY_OF_ATTRIBUTE extends AnyOfSchema,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? AnyOfAttribute_<$ANY_OF_ATTRIBUTE['state'], FreezeElements<$ANY_OF_ATTRIBUTE['elements']>>
  : AnyOfAttribute<$ANY_OF_ATTRIBUTE['state'], FreezeElements<$ANY_OF_ATTRIBUTE['elements']>>

type AnyOfAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ELEMENTS extends $AnyOfAttributeElements[]
>(
  state: STATE,
  elements: $ELEMENTS,
  path?: string
) => FreezeAnyOfAttribute<AnyOfSchema<STATE, $ELEMENTS>, true>

/**
 * Freezes a warm `anyOf` attribute
 *
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyOfAttribute: AnyOfAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ELEMENTS extends $AnyOfAttributeElements[]
>(
  state: STATE,
  elements: $ELEMENTS,
  path?: string
) => {
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
    const { required, hidden, savedAs } = element.state

    if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.optionalElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements must be required.`,
        path
      })
    }

    if (hidden !== undefined && hidden !== false) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.hiddenElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements cannot be hidden.`,
        path
      })
    }

    if (savedAs !== undefined) {
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

  return new AnyOfAttribute_({
    path,
    elements: frozenElements,
    ...state
  })
}
