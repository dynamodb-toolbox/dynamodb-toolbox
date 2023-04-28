import type { EntityV2, PutItem } from 'v1/entity'
import type { PossiblyUndefinedResolvedItem, RequiredOption } from 'v1/item'
import { cloneItemInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseItemClonedInput } from 'v1/validation/parseClonedInput'

type EntityPutCommandInputParser = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PossiblyUndefinedResolvedItem
) => PutItem<ENTITY>

const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneItemInputAndAddDefaults(entity.item, input, {
    computeDefaults: entity.computedDefaults
  })

  return parseItemClonedInput(entity.item, clonedInputWithDefaults, { requiringOptions }) as any
}
