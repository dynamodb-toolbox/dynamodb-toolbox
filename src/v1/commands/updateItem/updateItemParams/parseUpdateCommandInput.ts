import type { EntityV2 } from 'v1/entity'
import type { UndefinedAttrExtension, Item, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput, ParsedSchemaInput } from 'v1/validation/parseClonedInput'

type EntityUpdateCommandInputParser = (
  entity: EntityV2,
  input: Item<UndefinedAttrExtension>
) => ParsedSchemaInput<UndefinedAttrExtension>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityUpdateCommandInput: EntityUpdateCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input, {
    commandName: 'update'
    // Note: We do not provide defaults computer for now
    // computeDefaultsContext: { computeDefaults: entity.computedDefaults }
  })

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, { requiringOptions })
}
