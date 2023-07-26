import cloneDeep from 'lodash.clonedeep'

import type { Schema, Extension, Item, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isObject } from 'v1/utils/validation'

import { AttributeOptions, HasExtension, SchemaOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneSchemaInputAndAddDefaults = <EXTENSION extends Extension = never>(
  schema: Schema,
  input: Item<EXTENSION>,
  ...[options = {} as SchemaOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: SchemaOptions<EXTENSION>],
    [options?: SchemaOptions<EXTENSION>]
  >
): Item<EXTENSION> => {
  const { commandName, computeDefaultsContext, handleExtension } = options

  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: Item<EXTENSION> = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  const canComputeDefaults = computeDefaultsContext !== undefined

  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    let attributeInputWithDefaults: AttributeValue<EXTENSION> | undefined = undefined

    if (canComputeDefaults) {
      const { computeDefaults } = computeDefaultsContext

      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName],
        {
          commandName,
          computeDefaultsContext: {
            computeDefaults: computeDefaults && computeDefaults[attributeName],
            contextInputs: [input]
          },
          handleExtension
        } as AttributeOptions<EXTENSION>
      )
    } else {
      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName],
        { commandName, handleExtension } as AttributeOptions<EXTENSION>
      )
    }

    if (attributeInputWithDefaults !== undefined) {
      inputWithDefaults[attributeName] = attributeInputWithDefaults
    }

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    inputWithDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return inputWithDefaults
}
