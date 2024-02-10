import { DynamoDBToolboxError } from 'v1/errors'
import type { NarrowObject } from 'v1/types'
import type { SchemaAction } from './action'

import type { SchemaAttributes, $SchemaAttributeNestedStates } from './attributes'

import type { RequiredOption } from './attributes/constants/requiredOptions'
import type { FreezeAttribute } from './attributes/freeze'

export class Schema<ATTRIBUTES extends SchemaAttributes = SchemaAttributes> {
  type: 'schema'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: ATTRIBUTES

  constructor(attributes: NarrowObject<ATTRIBUTES>) {
    this.type = 'schema'
    this.attributes = attributes

    const savedAttributeNames = new Set<string>()
    const keyAttributeNames = new Set<string>()
    const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    for (const attributeName in attributes) {
      if (savedAttributeNames.has(attributeName)) {
        throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
          message: `Invalid schema: More than two attributes are named '${attributeName}'`,
          payload: { name: attributeName }
        })
      }

      const attribute = attributes[attributeName]

      const attributeSavedAs = attribute.savedAs ?? attributeName
      if (savedAttributeNames.has(attributeSavedAs)) {
        throw new DynamoDBToolboxError('schema.duplicateSavedAsAttributes', {
          message: `Invalid schema: More than two attributes are saved as '${attributeSavedAs}'`,
          payload: { savedAs: attributeSavedAs }
        })
      }
      savedAttributeNames.add(attributeSavedAs)

      if (attribute.key) {
        keyAttributeNames.add(attributeName)
      }

      requiredAttributeNames[attribute.required].add(attributeName)
    }

    this.savedAttributeNames = savedAttributeNames
    this.keyAttributeNames = keyAttributeNames
    this.requiredAttributeNames = requiredAttributeNames
  }

  and<$ADDITIONAL_ATTRIBUTES extends $SchemaAttributeNestedStates = $SchemaAttributeNestedStates>(
    additionalAttr:
      | NarrowObject<$ADDITIONAL_ATTRIBUTES>
      | ((schema: Schema<ATTRIBUTES>) => NarrowObject<$ADDITIONAL_ATTRIBUTES>)
  ): Schema<
    {
      [KEY in
        | keyof ATTRIBUTES
        | keyof $ADDITIONAL_ATTRIBUTES]: KEY extends keyof $ADDITIONAL_ATTRIBUTES
        ? FreezeAttribute<$ADDITIONAL_ATTRIBUTES[KEY]>
        : KEY extends keyof ATTRIBUTES
        ? ATTRIBUTES[KEY]
        : never
    }
  > {
    const additionalAttributes = (typeof additionalAttr === 'function'
      ? additionalAttr(this)
      : additionalAttr) as $SchemaAttributeNestedStates

    const nextAttributes = { ...this.attributes } as SchemaAttributes

    for (const attributeName in additionalAttributes) {
      if (attributeName in nextAttributes) {
        throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
          message: `Invalid schema: More than two attributes are named '${attributeName}'`,
          payload: { name: attributeName }
        })
      }

      const additionalAttribute = additionalAttributes[attributeName]
      nextAttributes[attributeName] = additionalAttribute.freeze(attributeName)
    }

    return new Schema(
      nextAttributes as NarrowObject<
        {
          [KEY in
            | keyof ATTRIBUTES
            | keyof $ADDITIONAL_ATTRIBUTES]: KEY extends keyof $ADDITIONAL_ATTRIBUTES
            ? FreezeAttribute<$ADDITIONAL_ATTRIBUTES[KEY]>
            : KEY extends keyof ATTRIBUTES
            ? ATTRIBUTES[KEY]
            : never
        }
      >
    )
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}

type SchemaTyper = <$ATTRIBUTES extends $SchemaAttributeNestedStates = {}>(
  attributes: NarrowObject<$ATTRIBUTES>
) => Schema<{ [KEY in keyof $ATTRIBUTES]: FreezeAttribute<$ATTRIBUTES[KEY]> }>

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
): Schema<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
> => new Schema<{}>({}).and(attributes)
