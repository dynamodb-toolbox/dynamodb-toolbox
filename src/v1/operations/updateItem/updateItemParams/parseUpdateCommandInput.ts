import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

import type { UpdateItemInputExtension } from '../types'
import { parseUpdateExtension } from './extension/parseExtension'

type EntityUpdateCommandInputParser = (
  entity: EntityV2,
  input: Item<UpdateItemInputExtension>
) => Generator<Item<UpdateItemInputExtension>, Item<UpdateItemInputExtension>>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityUpdateCommandInput: EntityUpdateCommandInputParser = (entity, input) => {
  const parser = parseSchemaClonedInput(entity.schema, input, {
    operationName: 'update',
    requiringOptions,
    parseExtension: parseUpdateExtension
  })

  parser.next() // cloned

  return parser
}
