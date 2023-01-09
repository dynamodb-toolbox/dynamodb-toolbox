import { EntityV2, PossiblyUndefinedResolvedItem, PutItem } from 'v1'

import { parseItemPutCommandInput } from './item'
import { cloneInputAndAddInitialDefaults } from './cloneInputAndAddInitialDefaults'

export const parseEntityPutCommandInput = <ENTITY extends EntityV2>(
  entity: EntityV2,
  input: PossiblyUndefinedResolvedItem
): PutItem<ENTITY> => {
  const clonedInputWithInitialDefaults = cloneInputAndAddInitialDefaults(entity.item, input)

  const clonedInputWithComputedDefaults = entity.computeDefaults
    ? entity.computeDefaults(clonedInputWithInitialDefaults)
    : clonedInputWithInitialDefaults

  return parseItemPutCommandInput<ENTITY['item']>(
    entity.item,
    clonedInputWithComputedDefaults
  ) as PutItem<ENTITY>
}
