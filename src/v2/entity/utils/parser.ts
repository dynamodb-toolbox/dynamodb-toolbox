import type { EntityV2 } from '../class'
import type { Output, SavedAs } from '../generics'

type Parser = <
  E extends EntityV2,
  S extends Record<string, any> = SavedAs<E>,
  O extends Record<string, any> = Output<E>
>(
  entity: E,
  savedAs: S
) => O

export const parse: Parser = (entity, savedAs) => {
  entity
  // TODO
  return savedAs as any
}
