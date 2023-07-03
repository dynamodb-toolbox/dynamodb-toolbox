import type { EntityV2 } from 'v1/entity'
import type { PossiblyUndefinedResolvedItem, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput, ParsedSchemaInput } from 'v1/validation/parseClonedInput'

type EntityPutCommandInputParser = (
  entity: EntityV2,
  input: PossiblyUndefinedResolvedItem
) => ParsedSchemaInput

const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input, {
    computeDefaults: entity.computedDefaults
  })

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, { requiringOptions })
}
