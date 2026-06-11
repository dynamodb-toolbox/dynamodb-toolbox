import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { AnyOfElementSchema, AnyOfSchema } from '~/schema/anyOf/index.js'
import { anyOf } from '~/schema/anyOf/index.js'

import { fromSchemaDTO } from './attribute.js'

type AnyOfSchemaDTO = Extract<ISchemaDTO, { type: 'anyOf' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromAnyOfSchemaDTO = ({
  elements,
  required,
  hidden,
  key,
  savedAs,
  discriminator
}: AnyOfSchemaDTO): AnyOfSchema => {
  /**
   * @debt types "fix those casts"
   */
  let anyOf_ = anyOf(...(elements.map(fromSchemaDTO) as AnyOfElementSchema[]))

  if (required !== undefined && required !== 'atLeastOnce') {
    anyOf_ = anyOf_.required(required)
  }

  if (hidden !== undefined && hidden) {
    anyOf_ = anyOf_.hidden(hidden)
  }

  if (key !== undefined && key) {
    anyOf_ = anyOf_.key(key)
  }

  if (savedAs !== undefined) {
    anyOf_ = anyOf_.savedAs(savedAs)
  }

  if (discriminator !== undefined) {
    anyOf_ = anyOf_.discriminate(discriminator)
  }

  return anyOf_
}
