import type { EntityV2, PossiblyUndefinedResolvedItem, KeyInput } from 'v1'
import { cloneInputAndAddDefaults } from 'v1/commands/utils/cloneInputAndAddDefaults'

import { parseItemKeyInput } from './item'

export const parseEntityKeyInput = <ENTITY extends EntityV2>(
  entity: EntityV2,
  input: PossiblyUndefinedResolvedItem
): KeyInput<ENTITY> => {
  const clonedInputWithDefaults = cloneInputAndAddDefaults(entity.item, input, {
    computeDefaults: undefined
  })

  const clonedInputWithComputedDefaults = clonedInputWithDefaults

  return parseItemKeyInput<ENTITY['item']>(
    entity.item,
    clonedInputWithComputedDefaults
  ) as KeyInput<ENTITY>
}
