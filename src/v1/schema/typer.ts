import type { $MapAttributeAttributes, MapAttributeAttributes, $Narrow, Narrow } from './attributes'
import { $key, $savedAs, $required } from './attributes/constants/attributeOptions'
import { DynamoDBToolboxError } from 'v1/errors'

import type { Schema } from './interface'
import type { RequiredOption } from './attributes/constants/requiredOptions'
import { FreezeAttribute, freezeAttribute } from './attributes/freeze'

type SchemaTyper = <$ATTRIBUTES extends $MapAttributeAttributes = {}>(
  attributes: $Narrow<$ATTRIBUTES>
) => Schema<{ [KEY in keyof $ATTRIBUTES]: FreezeAttribute<$ATTRIBUTES[KEY]> }>

type _SchemaTyper = <ATTRIBUTES extends MapAttributeAttributes = {}>(arg: {
  attributes: Narrow<ATTRIBUTES>
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
}) => Schema<ATTRIBUTES>

export const _schema: _SchemaTyper = <
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
>({
  attributes,
  savedAttributeNames,
  keyAttributeNames,
  requiredAttributeNames
}: {
  attributes: Narrow<ATTRIBUTES>
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
    and: $additionalAttr => {
      const $additionalAttributes = $additionalAttr as $MapAttributeAttributes

      const nextAttributes = { ...attributes } as MapAttributeAttributes
      const nextSavedAttributeNames = new Set(savedAttributeNames)
      const nextKeyAttributeNames = new Set(keyAttributeNames)
      const nextRequiredAttributeNames: Record<RequiredOption, Set<string>> = {
        always: new Set(requiredAttributeNames.always),
        atLeastOnce: new Set(requiredAttributeNames.atLeastOnce),
        never: new Set(requiredAttributeNames.never)
      }

      for (const attributeName in $additionalAttributes) {
        if (nextSavedAttributeNames.has(attributeName)) {
          throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
            message: `Invalid schema: More than two attributes are named '${attributeName}'`,
            payload: { name: attributeName }
          })
        }

        const attribute = $additionalAttributes[attributeName]

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

        nextAttributes[attributeName] = freezeAttribute(attribute, attributeName)
      }

      return _schema({
        attributes: nextAttributes,
        savedAttributeNames: nextSavedAttributeNames,
        keyAttributeNames: nextKeyAttributeNames,
        requiredAttributeNames: nextRequiredAttributeNames
      })
    }
  } as Schema<ATTRIBUTES>)

/**
 * Defines an Entity schema
 *
 * @param $schemaAttr Object of attributes
 * @return Schema
 */
export const schema: SchemaTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  $schemaAttr: $Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
): Schema<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
> =>
  _schema({
    attributes: {},
    savedAttributeNames: new Set(),
    keyAttributeNames: new Set(),
    requiredAttributeNames: {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }
  }).and($schemaAttr)
