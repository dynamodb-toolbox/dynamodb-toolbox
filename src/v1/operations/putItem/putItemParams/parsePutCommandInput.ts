import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { Parser } from 'v1/schema/actions/parse'

type EntityPutCommandInputParser = (entity: EntityV2, input: Item) => Generator<Item, Item>

const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const parseEntityPutCommandInput: EntityPutCommandInputParser = (entity, input) => {
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'put',
    transform: true,
    requiringOptions
  })

  workflow.next() // defaulted
  workflow.next() // linked

  return workflow
}
