import cloneDeep from 'lodash.clonedeep'

import type { Schema, Extension, Item, AttributeValue } from 'v1/schema'
import type { SchemaDefaultsComputer } from 'v1/entity'
import { isObject } from 'v1/utils/validation'

import { CommandName } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneSchemaInputAndAddDefaults = <EXTENSION extends Extension>(
  schema: Schema,
  input: Item<EXTENSION>,
  {
    commandName,
    computeDefaultsContext
  }: {
    commandName?: CommandName
    computeDefaultsContext?: { computeDefaults: SchemaDefaultsComputer }
  } = {}
): Item<EXTENSION> => {
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
            /**
             * @debt feature "make computeDefault available for keys & updates"
             */
            // @ts-expect-error
            contextInputs: [input]
          }
        }
      )
    } else {
      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName],
        { commandName }
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
