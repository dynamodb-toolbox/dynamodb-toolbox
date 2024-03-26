import { DynamoDBToolboxError } from 'v1/errors'
import type { Schema } from 'v1/schema'
import type { Attribute } from 'v1/schema/attributes'
import { addProperty } from 'v1/utils/addProperty'

export type WithInternalAttribute<
  SCHEMA extends Schema,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE extends Attribute
> = Schema<Omit<SCHEMA['attributes'], ATTRIBUTE_NAME> & Record<ATTRIBUTE_NAME, ATTRIBUTE>>

export const addInternalAttribute = <
  SCHEMA extends Schema,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE extends Attribute
>(
  schema: SCHEMA,
  attributeName: ATTRIBUTE_NAME,
  attribute: ATTRIBUTE
): WithInternalAttribute<SCHEMA, ATTRIBUTE_NAME, ATTRIBUTE> => {
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

  schema.attributes = addProperty<SCHEMA['attributes'], ATTRIBUTE_NAME, ATTRIBUTE>(
    schema.attributes,
    attributeName,
    attribute
  )

  if (attribute.savedAs !== undefined) {
    schema.savedAttributeNames.add(attribute.savedAs)
  }

  if (attribute.key) {
    schema.keyAttributeNames.add(attributeName)
  }

  schema.requiredAttributeNames[attribute.required].add(attributeName)

  // schema is actually muted but TS doesn't recognize it
  return (schema as unknown) as WithInternalAttribute<SCHEMA, ATTRIBUTE_NAME, ATTRIBUTE>
}
