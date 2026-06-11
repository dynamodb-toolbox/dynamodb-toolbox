import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { TupleSchema } from '~/schema/tuple/index.js'
import { tuple } from '~/schema/tuple/index.js'
import type { TupleElementSchema } from '~/schema/tuple/types.js'

import { fromSchemaDTO } from './attribute.js'

type TupleSchemaDTO = Extract<ISchemaDTO, { type: 'tuple' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromTupleSchemaDTO = ({
  elements,
  required,
  hidden,
  key,
  savedAs
}: TupleSchemaDTO): TupleSchema => {
  /**
   * @debt types "fix those casts"
   */
  let tuple_ = tuple(...(elements.map(fromSchemaDTO) as TupleElementSchema[]))

  if (required !== undefined && required !== 'atLeastOnce') {
    tuple_ = tuple_.required(required)
  }

  if (hidden !== undefined && hidden) {
    tuple_ = tuple_.hidden(hidden)
  }

  if (key !== undefined && key) {
    tuple_ = tuple_.key(key)
  }

  if (savedAs !== undefined) {
    tuple_ = tuple_.savedAs(savedAs)
  }

  return tuple_
}
