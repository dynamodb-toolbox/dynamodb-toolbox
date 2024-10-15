import type { RequiredOption } from '~/attributes/constants/requiredOptions.js'
import type { FreezeAttribute } from '~/attributes/freeze.js'
import type {
  $SchemaAttributeNestedStates,
  Attribute,
  SchemaAttributes
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { NarrowObject } from '~/types/index.js'

export class Schema<ATTRIBUTES extends SchemaAttributes = SchemaAttributes> {
  type: 'schema'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: ATTRIBUTES

  constructor(attributes: NarrowObject<ATTRIBUTES>) {
    this.type = 'schema'
    this.attributes = attributes

    this.savedAttributeNames = new Set<string>()
    this.keyAttributeNames = new Set<string>()
    this.requiredAttributeNames = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    for (const attributeName in attributes) {
      if (this.savedAttributeNames.has(attributeName)) {
        throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
          message: `Invalid schema: More than two attributes are named '${attributeName}'`,
          payload: { name: attributeName }
        })
      }

      const attribute = attributes[attributeName]

      const attributeSavedAs = attribute.savedAs ?? attributeName
      if (this.savedAttributeNames.has(attributeSavedAs)) {
        throw new DynamoDBToolboxError('schema.duplicateSavedAsAttributes', {
          message: `Invalid schema: More than two attributes are saved as '${attributeSavedAs}'`,
          payload: { savedAs: attributeSavedAs }
        })
      }
      this.savedAttributeNames.add(attributeSavedAs)

      if (attribute.key) {
        this.keyAttributeNames.add(attributeName)
      }

      this.requiredAttributeNames[attribute.required].add(attributeName)
    }
  }

  pick<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): Schema<Pick<ATTRIBUTES, ATTRIBUTE_NAMES[number]>> {
    const nextAttributes = {} as ATTRIBUTES

    for (const attributeName of attributeNames) {
      if (!(attributeName in this.attributes)) {
        continue
      }

      nextAttributes[attributeName] = this.attributes[attributeName]
    }

    return new Schema<Pick<ATTRIBUTES, ATTRIBUTE_NAMES[number]>>(nextAttributes)
  }

  omit<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): Schema<Omit<ATTRIBUTES, ATTRIBUTE_NAMES[number]>> {
    const nextAttributes = { ...this.attributes }

    for (const attributeName of attributeNames) {
      delete nextAttributes[attributeName]
    }

    return new Schema<Omit<ATTRIBUTES, ATTRIBUTE_NAMES[number]>>(nextAttributes)
  }

  and<$ADDITIONAL_ATTRIBUTES extends $SchemaAttributeNestedStates = $SchemaAttributeNestedStates>(
    additionalAttr:
      | NarrowObject<$ADDITIONAL_ATTRIBUTES>
      | ((schema: Schema<ATTRIBUTES>) => NarrowObject<$ADDITIONAL_ATTRIBUTES>)
  ): Schema<{
    [KEY in
      | keyof ATTRIBUTES
      | keyof $ADDITIONAL_ATTRIBUTES]: KEY extends keyof $ADDITIONAL_ATTRIBUTES
      ? FreezeAttribute<$ADDITIONAL_ATTRIBUTES[KEY], true>
      : KEY extends keyof ATTRIBUTES
        ? ATTRIBUTES[KEY]
        : never
  }> {
    const additionalAttributes = (
      typeof additionalAttr === 'function' ? additionalAttr(this) : additionalAttr
    ) as $SchemaAttributeNestedStates

    const nextAttributes = { ...this.attributes } as SchemaAttributes

    for (const [attributeName, additionalAttribute] of Object.entries(additionalAttributes)) {
      if (attributeName in nextAttributes) {
        throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
          message: `Invalid schema: More than two attributes are named '${attributeName}'`,
          payload: { name: attributeName }
        })
      }

      nextAttributes[attributeName] = additionalAttribute.freeze(attributeName)
    }

    return new Schema(
      nextAttributes as NarrowObject<{
        [KEY in
          | keyof ATTRIBUTES
          | keyof $ADDITIONAL_ATTRIBUTES]: KEY extends keyof $ADDITIONAL_ATTRIBUTES
          ? FreezeAttribute<$ADDITIONAL_ATTRIBUTES[KEY], true>
          : KEY extends keyof ATTRIBUTES
            ? ATTRIBUTES[KEY]
            : never
      }>
    )
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}

type SchemaTyper = <$ATTRIBUTES extends $SchemaAttributeNestedStates = {}>(
  attributes: NarrowObject<$ATTRIBUTES>
) => Schema<{ [KEY in keyof $ATTRIBUTES]: FreezeAttribute<$ATTRIBUTES[KEY], true> }>

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
): Schema<{
  [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY], true>
}> => new Schema<{}>({}).and(attributes)

export class SchemaAction<SCHEMA extends Schema | Attribute = Schema | Attribute> {
  constructor(public schema: SCHEMA) {}
}
