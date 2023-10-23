import cloneDeep from 'lodash.clonedeep'

import type { Schema, Extension, Item, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isObject } from 'v1/utils/validation'

import type { HasExtension } from '../types'
import type { AttributeCloningOptions, SchemaCloningOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneSchemaInputAndAddDefaults = <EXTENSION extends Extension = never>(
  schema: Schema,
  input: Item<EXTENSION>,
  ...[options = {} as SchemaCloningOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: SchemaCloningOptions<EXTENSION>],
    [options?: SchemaCloningOptions<EXTENSION>]
  >
): Item<EXTENSION> => {
  const { commandName, cloneExtension } = options

  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: Item<EXTENSION> = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    let attributeInputWithDefaults: AttributeValue<EXTENSION> | undefined = undefined

    attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
      attribute,
      input[attributeName],
      {
        commandName,
        originalInput: input,
        cloneExtension
      } as AttributeCloningOptions<EXTENSION>
    )

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
