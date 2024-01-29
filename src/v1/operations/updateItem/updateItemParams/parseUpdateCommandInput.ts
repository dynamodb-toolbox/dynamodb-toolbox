import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { schemaParser } from 'v1/parsing'

import type { UpdateItemInputExtension } from '../types'
import { parseUpdateExtension } from './extension/parseExtension'

type EntityUpdateCommandInputParser = (
  entity: EntityV2,
  input: Item<UpdateItemInputExtension>
) => Generator<Item<UpdateItemInputExtension>, Item<UpdateItemInputExtension>>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityUpdateCommandInput: EntityUpdateCommandInputParser = (entity, input) => {
  const parser = schemaParser(entity.schema, input, {
    fill: 'update',
    transform: true,
    requiringOptions,
    parseExtension: parseUpdateExtension
  })

  parser.next() // defaulted
  parser.next() // linked

  return parser
}
