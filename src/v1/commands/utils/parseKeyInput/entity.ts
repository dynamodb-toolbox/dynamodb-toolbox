import type { EntityV2, KeyInput } from 'v1/entity'
import type { PossiblyUndefinedResolvedItem } from 'v1/item'
import { cloneInputAndAddDefaults } from 'v1/commands/utils/cloneInputAndAddDefaults'

import { parseItemKeyInput } from './item'

type EntityKeyInputParser = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PossiblyUndefinedResolvedItem
) => KeyInput<ENTITY>

export const parseEntityKeyInput: EntityKeyInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneInputAndAddDefaults(entity.item, input, {
    computeDefaults: undefined
  })

  return parseItemKeyInput(entity.item, clonedInputWithDefaults) as any
}
