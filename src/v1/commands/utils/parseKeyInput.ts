import type { EntityV2 } from 'v1/entity'
import type { Item, UndefinedAttrExtension, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

import { ParsedItem, parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityKeyInputParser = (
  entity: EntityV2,
  input: Item<UndefinedAttrExtension>
) => ParsedItem<UndefinedAttrExtension>

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
