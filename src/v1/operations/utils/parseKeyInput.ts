import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { Parser } from 'v1/schema/actions/parse'

type EntityKeyInputParser = (entity: EntityV2, input: Item) => Generator<Item, Item>

const requiringOptions = new Set<RequiredOption>(['always'])

export const parseEntityKeyInput: EntityKeyInputParser = (entity, input) => {
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'key',
    transform: true,
    filters: { key: true },
    requiringOptions
  })

  workflow.next() // defaulted
  workflow.next() // linked

  return workflow
}
