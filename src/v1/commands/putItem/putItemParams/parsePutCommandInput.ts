import type { EntityV2 } from 'v1/entity'
import type { ResolvedItem, PossiblyUndefinedAdditionalResolution, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput, ParsedSchemaInput } from 'v1/validation/parseClonedInput'

type EntityPutCommandInputParser = (
  entity: EntityV2,
  input: ResolvedItem<PossiblyUndefinedAdditionalResolution>
) => ParsedSchemaInput<PossiblyUndefinedAdditionalResolution>

const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input, {
    commandName: 'put',
    computeDefaultsContext: { computeDefaults: entity.computedDefaults }
  })

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, { requiringOptions })
}
