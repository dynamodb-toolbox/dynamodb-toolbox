import { DynamoDBToolboxError } from 'v1/errors'
import type { Schema, Attribute } from 'v1/schema'
import { addProperty } from 'v1/utils/addProperty'

export type WithRootAttribute<
  SCHEMA extends Schema,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE extends Attribute
> = Schema<Omit<SCHEMA['attributes'], ATTRIBUTE_NAME> & Record<ATTRIBUTE_NAME, ATTRIBUTE>>

export const addRootAttribute = <
  SCHEMA extends Schema,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE extends Attribute
>(
  schema: SCHEMA,
  attributeName: ATTRIBUTE_NAME,
  attribute: ATTRIBUTE
): WithRootAttribute<SCHEMA, ATTRIBUTE_NAME, ATTRIBUTE> => {
  if (attributeName in schema.attributes) {
    throw new DynamoDBToolboxError('entity.reservedAttributeName', {
      message: `'${attributeName}' is a reserved attribute name.`,
      path: attributeName
    })
  }

  if (attribute.savedAs !== undefined && attribute.savedAs in schema.savedAttributeNames) {
    throw new DynamoDBToolboxError('entity.reservedAttributeSavedAs', {
      message: `'${attribute.savedAs}' is a reserved attribute alias (savedAs).`,
      path: attributeName
    })
  }

  return {
    type: schema.type,
    savedAttributeNames:
      attribute.savedAs !== undefined
        ? new Set([...schema.savedAttributeNames, attribute.savedAs])
        : schema.savedAttributeNames,
    keyAttributeNames: attribute.key
      ? new Set([...schema.keyAttributeNames, attributeName])
      : schema.keyAttributeNames,
    requiredAttributeNames: {
      ...schema.requiredAttributeNames,
      [attribute.required]: new Set([
        ...schema.requiredAttributeNames[attribute.required],
        attributeName
      ])
    },
    attributes: addProperty(schema.attributes, attributeName, attribute)
  }
}
