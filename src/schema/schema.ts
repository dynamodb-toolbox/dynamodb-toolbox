import type { RequiredOption } from '~/attributes/constants/requiredOptions.js'
import type { AttrSchema, SchemaAttributes } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { NarrowObject } from '~/types/index.js'

import type { ResetLinks } from './utils/resetLinks.js'
import { resetLinks } from './utils/resetLinks.js'

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

      const attributeSavedAs = attribute.props.savedAs ?? attributeName
      if (this.savedAttributeNames.has(attributeSavedAs)) {
        throw new DynamoDBToolboxError('schema.duplicateSavedAsAttributes', {
          message: `Invalid schema: More than two attributes are saved as '${attributeSavedAs}'`,
          payload: { savedAs: attributeSavedAs }
        })
      }
      this.savedAttributeNames.add(attributeSavedAs)

      if (attribute.props.key) {
        this.keyAttributeNames.add(attributeName)
      }

      this.requiredAttributeNames[attribute.props.required ?? 'atLeastOnce'].add(attributeName)
    }
  }

  pick<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): Schema<{
    [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
  }> {
    const nextAttributes = {} as {
      [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
    }

    for (const attributeName of attributeNames) {
      if (!(attributeName in this.attributes)) {
        continue
      }

      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new Schema(nextAttributes)
  }

  omit<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): Schema<{
    [KEY in Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>]: ResetLinks<ATTRIBUTES[KEY]>
  }> {
    const nextAttributes = {} as {
      [KEY in Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>]: ResetLinks<ATTRIBUTES[KEY]>
    }

    const attributeNamesSet = new Set(attributeNames)
    for (const _attributeName of Object.keys(this.attributes) as (keyof ATTRIBUTES)[]) {
      if (attributeNamesSet.has(_attributeName)) {
        continue
      }

      const attributeName = _attributeName as Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>
      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new Schema(nextAttributes)
  }

  and<ADDITIONAL_ATTRIBUTES extends SchemaAttributes = SchemaAttributes>(
    additionalAttr:
      | NarrowObject<ADDITIONAL_ATTRIBUTES>
      | ((schema: Schema<ATTRIBUTES>) => NarrowObject<ADDITIONAL_ATTRIBUTES>)
  ): Schema<{
    [KEY in keyof ATTRIBUTES | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
      ? ADDITIONAL_ATTRIBUTES[KEY]
      : KEY extends keyof ATTRIBUTES
        ? ATTRIBUTES[KEY]
        : never
  }> {
    const additionalAttributes = (
      typeof additionalAttr === 'function' ? additionalAttr(this) : additionalAttr
    ) as SchemaAttributes

    const nextAttributes = { ...this.attributes } as SchemaAttributes

    for (const [attributeName, additionalAttribute] of Object.entries(additionalAttributes)) {
      if (attributeName in nextAttributes) {
        throw new DynamoDBToolboxError('schema.duplicateAttributeNames', {
          message: `Invalid schema: More than two attributes are named '${attributeName}'`,
          payload: { name: attributeName }
        })
      }

      nextAttributes[attributeName] = additionalAttribute
    }

    return new Schema(
      nextAttributes as NarrowObject<{
        [KEY in
          | keyof ATTRIBUTES
          | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
          ? ADDITIONAL_ATTRIBUTES[KEY]
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

type SchemaTyper = <ATTRIBUTES extends SchemaAttributes = {}>(
  attributes: NarrowObject<ATTRIBUTES>
) => Schema<ATTRIBUTES>

/**
 * Defines an Entity schema
 *
 * @param attributes Dictionary of warm attributes
 * @return Schema
 */
export const schema: SchemaTyper = attributes => new Schema<{}>({}).and(attributes)

export class SchemaAction<SCHEMA extends Schema | AttrSchema = Schema | AttrSchema> {
  constructor(public schema: SCHEMA) {}
}
