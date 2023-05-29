import type { EntityV2, KeyInput } from 'v1/entity'
import type { PossiblyUndefinedResolvedItem, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityKeyInputParser = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PossiblyUndefinedResolvedItem
) => KeyInput<ENTITY>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityKeyInput: EntityKeyInputParser = (entity, input) => {
  // Note: We do not provide defaults computer for now
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input)

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, {
    requiringOptions,
    filters: { key: true }
  }) as any
}
