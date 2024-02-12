import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { Parser } from 'v1/schema/actions/parse'

import type { UpdateItemInputExtension } from '../types'
import { parseUpdateExtension } from './extension/parseExtension'

type EntityUpdateCommandInputParser = (
  entity: EntityV2,
  input: Item<UpdateItemInputExtension>
) => Generator<Item<UpdateItemInputExtension>, Item<UpdateItemInputExtension>>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityUpdateCommandInput: EntityUpdateCommandInputParser = (entity, input) => {
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'update',
    transform: true,
    requiringOptions,
    parseExtension: parseUpdateExtension
  })

  workflow.next() // defaulted
  workflow.next() // linked

  return workflow
}
