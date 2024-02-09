import { DynamoDBToolboxError } from 'v1/errors'
import type { NarrowObject } from 'v1/types'

import type { SchemaAttributes, $SchemaAttributeNestedStates } from './attributes'
import { $key, $savedAs, $required } from './attributes/constants/attributeOptions'

import type { MegaSchema } from './interface'
import type { RequiredOption } from './attributes/constants/requiredOptions'
import type { FreezeAttribute } from './attributes/types'

type $SchemaTyper = <ATTRIBUTES extends SchemaAttributes = {}>(arg: {
  attributes: NarrowObject<ATTRIBUTES>
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
}) => MegaSchema<ATTRIBUTES>

const $schema: $SchemaTyper = <ATTRIBUTES extends SchemaAttributes = SchemaAttributes>({
  attributes,
  savedAttributeNames,
  keyAttributeNames,
  requiredAttributeNames
}: {
  attributes: NarrowObject<ATTRIBUTES>
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
}) =>
  ({
    type: 'schema',
    attributes,
    savedAttributeNames,
    keyAttributeNames,
    requiredAttributeNames,
    parse: input => input as any,
    and: additionalAttr => {
      const additionalAttributes = (typeof additionalAttr === 'function'
        ? additionalAttr(
            $schema({ attributes, savedAttributeNames, keyAttributeNames, requiredAttributeNames })
          )
        : additionalAttr) as $SchemaAttributeNestedStates

      const nextAttributes = { ...attributes } as SchemaAttributes
      const nextSavedAttributeNames = new Set(savedAttributeNames)
      const nextKeyAttributeNames = new Set(keyAttributeNames)
      const nextRequiredAttributeNames: Record<RequiredOption, Set<string>> = {
        always: new Set(requiredAttributeNames.always),
        atLeastOnce: new Set(requiredAttributeNames.atLeastOnce),
        never: new Set(requiredAttributeNames.never)
      }

      for (const attributeName in additionalAttributes) {
        if (nextSavedAttributeNames.has(attributeName)) {
          throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
            message: `Invalid schema: More than two attributes are named '${attributeName}'`,
            payload: { name: attributeName }
          })
        }

        const attribute = additionalAttributes[attributeName]

        const attributeSavedAs = attribute[$savedAs] ?? attributeName
        if (nextSavedAttributeNames.has(attributeSavedAs)) {
          throw new DynamoDBToolboxError('schema.duplicateSavedAsAttributes', {
            message: `Invalid schema: More than two attributes are saved as '${attributeSavedAs}'`,
            payload: { savedAs: attributeSavedAs }
          })
        }
        nextSavedAttributeNames.add(attributeSavedAs)

        if (attribute[$key]) {
          nextKeyAttributeNames.add(attributeName)
        }

        nextRequiredAttributeNames[attribute[$required]].add(attributeName)

        nextAttributes[attributeName] = attribute.freeze(attributeName)
      }

      return $schema({
        attributes: nextAttributes,
        savedAttributeNames: nextSavedAttributeNames,
        keyAttributeNames: nextKeyAttributeNames,
        requiredAttributeNames: nextRequiredAttributeNames
      })
    }
  } as MegaSchema<ATTRIBUTES>)

type SchemaTyper = <$ATTRIBUTES extends $SchemaAttributeNestedStates = {}>(
  attributes: NarrowObject<$ATTRIBUTES>
) => MegaSchema<{ [KEY in keyof $ATTRIBUTES]: FreezeAttribute<$ATTRIBUTES[KEY]> }>

/**
 * Defines an Entity schema
 *
 * @param attributes Dictionary of warm attributes
 * @return Schema
 */
export const schema: SchemaTyper = <
  $MAP_ATTRIBUTE_ATTRIBUTES extends $SchemaAttributeNestedStates = {}
>(
  attributes: NarrowObject<$MAP_ATTRIBUTE_ATTRIBUTES>
): MegaSchema<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
> =>
  $schema({
    attributes: {},
    savedAttributeNames: new Set(),
    keyAttributeNames: new Set(),
    requiredAttributeNames: {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }
  }).and(attributes) as MegaSchema<
    { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
  >
