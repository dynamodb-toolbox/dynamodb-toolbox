import type { EntityV2, PossiblyUndefinedResolvedItem, PutItem } from 'v1'
import { cloneInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

import { parseItemPutCommandInput } from './item'

type EntityPutCommandInputParser = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PossiblyUndefinedResolvedItem
) => PutItem<ENTITY>

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneInputAndAddDefaults(entity.item, input, {
    computeDefaults: entity.computedDefaults
  })

  return parseItemPutCommandInput(entity.item, clonedInputWithDefaults) as any
}
