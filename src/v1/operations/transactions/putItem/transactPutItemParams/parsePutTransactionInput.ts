import type { EntityV2 } from 'v1/entity'
import type { Item, RequiredOption } from 'v1/schema'
import { parseSchemaClonedInput } from 'v1/validation/parseClonedInput'

type EntityPutCommandInputParser = (entity: EntityV2, input: Item) => Generator<Item, Item>

const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const parseEntityPutTransactionInput: EntityPutCommandInputParser = (entity, input) => {
  const parser = parseSchemaClonedInput(entity.schema, input, {
    requiringOptions,
    operationName: 'put'
  })

  const clonedInput = parser.next() // cloned
  parser.next(clonedInput) // linked

  return parser
}
