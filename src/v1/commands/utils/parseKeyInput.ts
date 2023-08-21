import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import type { ParsedItem } from 'v1/validation/types'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityKeyInputParser = (entity: EntityV2, input: Item) => ParsedItem

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityKeyInput: EntityKeyInputParser = (entity, input) => {
  /**
   * @debt defaults "We do not provide defaults computer for now"
   */
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input)

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, {
    requiringOptions,
    filters: { key: true }
  })
}
