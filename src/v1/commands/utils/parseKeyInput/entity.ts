import { EntityV2, PossiblyUndefinedResolvedItem, KeyInput } from 'v1'
import { cloneInputAndAddInitialDefaults } from 'v1/commands/utils/cloneInputAndAddInitialDefaults'

import { parseItemKeyInput } from './item'

export const parseEntityKeyInput = <ENTITY extends EntityV2>(
  entity: EntityV2,
  input: PossiblyUndefinedResolvedItem
): KeyInput<ENTITY> => {
  const clonedInputWithInitialDefaults = cloneInputAndAddInitialDefaults(entity.item, input)

  const clonedInputWithComputedDefaults = entity.computeDefaults
    ? entity.computeDefaults(clonedInputWithInitialDefaults)
    : clonedInputWithInitialDefaults

  return parseItemKeyInput<ENTITY['item']>(
    entity.item,
    clonedInputWithComputedDefaults
  ) as KeyInput<ENTITY>
}
