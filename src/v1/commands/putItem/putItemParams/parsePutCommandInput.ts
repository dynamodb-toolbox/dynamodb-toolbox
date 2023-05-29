import type { EntityV2, PutItem } from 'v1/entity'
import type { PossiblyUndefinedResolvedItem, RequiredOption } from 'v1/schema'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityPutCommandInputParser = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PossiblyUndefinedResolvedItem
) => PutItem<ENTITY>

const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input, {
    computeDefaults: entity.computedDefaults
  })

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, { requiringOptions }) as any
}
