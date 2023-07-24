import type { EntityV2 } from 'v1/entity'
import type { ResolvedItem, PossiblyUndefinedAdditionalResolution, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

import { ParsedSchemaInput, parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityKeyInputParser = (
  entity: EntityV2,
  input: ResolvedItem<PossiblyUndefinedAdditionalResolution>
) => ParsedSchemaInput<PossiblyUndefinedAdditionalResolution>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityKeyInput: EntityKeyInputParser = (entity, input) => {
  // Note: We do not provide defaults computer for now
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input)

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, {
    requiringOptions,
    filters: { key: true }
  })
}
