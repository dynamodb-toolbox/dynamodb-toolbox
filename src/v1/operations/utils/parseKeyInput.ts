import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { schemaParser } from 'v1/parsing'

type EntityKeyInputParser = (entity: EntityV2, input: Item) => Generator<Item, Item>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityKeyInput: EntityKeyInputParser = (entity, input) => {
  const parser = schemaParser(entity.schema, input, {
    fill: 'key',
    filters: { key: true },
    requiringOptions
  })

  parser.next() // defaulted
  parser.next() // linked

  return parser
}
