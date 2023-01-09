import { EntityV2, PossiblyUndefinedResolvedItem, PutItem } from 'v1'
import { cloneInputAndAddInitialDefaults } from 'v1/commands/utils/cloneInputAndAddInitialDefaults'

import { parseItemPutCommandInput } from './item'

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
