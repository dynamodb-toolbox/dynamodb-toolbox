import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import type { ParsedItem } from 'v1/validation/types'
import { cloneSchemaInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityPutCommandInputParser = (entity: EntityV2, input: Item) => ParsedItem

const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const clonedInputWithDefaults = cloneSchemaInputAndAddDefaults(entity.schema, input, {
    commandName: 'put'
  })

  return parseSchemaClonedInput(entity.schema, clonedInputWithDefaults, { requiringOptions })
}
