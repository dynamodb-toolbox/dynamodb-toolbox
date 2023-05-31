import type { $MapAttributeAttributes, MapAttributeAttributes, Narrow } from './attributes'
import { $key, $savedAs, $required } from './attributes/constants/attributeOptions'
import { DynamoDBToolboxError } from 'v1/errors'

import type { Schema } from './interface'
import type { RequiredOption } from './attributes/constants/requiredOptions'
import { FreezeAttribute, freezeAttribute } from './attributes/freeze'

type SchemaTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  attributes: Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
) => Schema<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
>

/**
 * Defines an Entity schema
 *
 * @param $schemaAttr Object of attributes
 * @return Schema
 */
export const schema: SchemaTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  $schemaAttr: Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
): Schema<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
> => {
  const $schemaAttributes = $schemaAttr as $MapAttributeAttributes

  const schemaAttributes: MapAttributeAttributes = {}
  const savedAttributeNames = new Set<string>()
  const keyAttributeNames = new Set<string>()
  const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    never: new Set()
  }

  for (const attributeName in $schemaAttributes) {
    const attribute = $schemaAttributes[attributeName]

    const attributeSavedAs = attribute[$savedAs] ?? attributeName
    if (savedAttributeNames.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('schema.duplicateSavedAsAttributes', {
        message: `Invalid schema: More than two attributes are saved as '${attributeSavedAs}'`,
        payload: { savedAs: attributeSavedAs }
      })
    }
    savedAttributeNames.add(attributeSavedAs)

    if (attribute[$key]) {
      keyAttributeNames.add(attributeName)
    }

    requiredAttributeNames[attribute[$required]].add(attributeName)

    schemaAttributes[attributeName] = freezeAttribute(attribute, attributeName)
  }

  return {
    type: 'schema',
    savedAttributeNames,
    keyAttributeNames,
    requiredAttributeNames,
    attributes: schemaAttributes
  } as Schema<
    { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
  >
}
