import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import type { ParsedItem } from 'v1/validation/types'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

import type { UpdateItemInputExtension } from '../types'
import { cloneUpdateExtension } from './extension/cloneExtension'
import { parseUpdateExtension } from './extension/parseExtension'

type EntityUpdateCommandInputParser = (
  entity: EntityV2,
  input: Item<UpdateItemInputExtension>
) => ParsedItem<UpdateItemInputExtension>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityUpdateCommandInput: EntityUpdateCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input, {
    commandName: 'update',
    computeDefaultsContext: { computeDefaults: entity.updateDefaults },
    cloneExtension: cloneUpdateExtension
  })

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, {
    requiringOptions,
    parseExtension: parseUpdateExtension
  })
}
