import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'
import { isArray } from 'v1/utils/validation'

import { freezeAttribute, FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import type { $AnyOfAttribute, AnyOfAttribute } from './interface'

export type FreezeAnyOfAttribute<$ANY_OF_ATTRIBUTES extends $AnyOfAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    AnyOfAttribute<
      FreezeAttribute<$ANY_OF_ATTRIBUTES[$elements][number]>,
      {
        required: $ANY_OF_ATTRIBUTES[$required]
        hidden: $ANY_OF_ATTRIBUTES[$hidden]
        key: $ANY_OF_ATTRIBUTES[$key]
        savedAs: $ANY_OF_ATTRIBUTES[$savedAs]
        defaults: $ANY_OF_ATTRIBUTES[$defaults]
      }
    >,
    never,
    never
  >

type AnyOfAttributeFreezer = <$ANY_OF_ATTRIBUTES extends $AnyOfAttribute>(
  $anyOfAttribute: $ANY_OF_ATTRIBUTES,
  path: string
) => FreezeAnyOfAttribute<$ANY_OF_ATTRIBUTES>

/**
 * Freezes a list instance
 *
 * @param $anyOfAttribute AnyOf
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyOfAttribute: AnyOfAttributeFreezer = <
  $ANY_OF_ATTRIBUTES extends $AnyOfAttribute
>(
  $anyOfAttribute: $ANY_OF_ATTRIBUTES,
  path: string
): FreezeAnyOfAttribute<$ANY_OF_ATTRIBUTES> => {
  validateAttributeProperties($anyOfAttribute, path)

  const frozenElements: FreezeAttribute<$ANY_OF_ATTRIBUTES[$elements][number]>[] = []

  if (!isArray($anyOfAttribute[$elements])) {
    throw new DynamoDBToolboxError('schema.anyOfAttribute.invalidElements', {
      message: `Invalid anyOf elements at path ${path}: AnyOf elements must be an array`,
      path
    })
  }

  if ($anyOfAttribute[$elements].length === 0) {
    throw new DynamoDBToolboxError('schema.anyOfAttribute.missingElements', {
      message: `Invalid anyOf elements at path ${path}: AnyOf attributes must have at least one element`,
      path
    })
  }

  $anyOfAttribute[$elements].forEach(element => {
    if (element[$required] !== 'atLeastOnce' && element[$required] !== 'always') {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.optionalElements', {
        message: `Invalid anyOf elements at path ${path}: AnyOf elements must be required`,
        path
      })
    }

    if (element[$hidden] !== false) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.hiddenElements', {
        message: `Invalid anyOf elements at path ${path}: AnyOf elements cannot be hidden`,
        path
      })
    }

    if (element[$savedAs] !== undefined) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.savedAsElements', {
        message: `Invalid anyOf elements at path ${path}: AnyOf elements cannot be renamed (have savedAs option)`,
        path
      })
    }

    // TODO: factorize
    if (element[$defaults].put !== undefined || element[$defaults].update !== undefined) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.defaultedElements', {
        message: `Invalid anyOf elements at path ${path}: AnyOf elements cannot have default values`,
        path
      })
    }

    frozenElements.push(
      freezeAttribute(element, path) as FreezeAttribute<$ANY_OF_ATTRIBUTES[$elements][number]>
    )
  })

  return {
    path,
    type: $anyOfAttribute[$type],
    elements: frozenElements,
    required: $anyOfAttribute[$required],
    hidden: $anyOfAttribute[$hidden],
    key: $anyOfAttribute[$key],
    savedAs: $anyOfAttribute[$savedAs],
    defaults: $anyOfAttribute[$defaults]
  }
}
