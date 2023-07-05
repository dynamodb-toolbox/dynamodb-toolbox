import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  PossiblyUndefinedResolvedItem,
  PossiblyUndefinedResolvedAttribute
} from 'v1/schema'
import type { SchemaDefaultsComputer } from 'v1/entity'
import { isObject } from 'v1/utils/validation'

import { CommandName } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneSchemaInputAndAddDefaults = (
  schema: Schema,
  input: PossiblyUndefinedResolvedItem,
  {
    commandName,
    computeDefaultsContext
  }: {
    commandName?: CommandName
    computeDefaultsContext?: { computeDefaults: SchemaDefaultsComputer }
  } = {}
): PossiblyUndefinedResolvedItem => {
  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: PossiblyUndefinedResolvedItem = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  const canComputeDefaults = computeDefaultsContext !== undefined

  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    let attributeInputWithDefaults: PossiblyUndefinedResolvedAttribute = undefined

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
