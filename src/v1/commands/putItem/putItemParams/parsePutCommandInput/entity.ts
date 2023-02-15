import { EntityV2, PossiblyUndefinedResolvedItem, PutItem } from 'v1'
import { cloneInputAndAddDefaults } from 'v1/commands/utils/cloneInputAndAddDefaults'

import { parseItemPutCommandInput } from './item'

export const parseEntityPutCommandInput = <ENTITY extends EntityV2>(
  entity: EntityV2,
  input: PossiblyUndefinedResolvedItem
): PutItem<ENTITY> => {
  const clonedInputWithDefaults = cloneInputAndAddDefaults(entity.item, input, {
    computeDefaults: entity.computedDefaults
  })

  return parseItemPutCommandInput(entity.item, clonedInputWithDefaults) as PutItem<ENTITY>
}
