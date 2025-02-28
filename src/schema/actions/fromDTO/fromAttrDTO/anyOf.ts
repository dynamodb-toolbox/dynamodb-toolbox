import type { AnyOfElementSchema, AnyOfSchema } from '~/attributes/anyOf/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromSchemaDTO } from './attribute.js'

type AnyOfAttrDTO = Extract<AttributeDTO, { type: 'anyOf' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromAnyOfSchemaDTO = ({ elements, ...props }: AnyOfAttrDTO): AnyOfSchema => {
  /**
   * @debt types "fix those casts"
   */
  let $attr = anyOf(...(elements.map(fromSchemaDTO) as AnyOfElementSchema[]))

  const {
    required,
    hidden,
    key,
    savedAs,
    keyDefault,
    putDefault,
    updateDefault,
    keyLink,
    putLink,
    updateLink
  } = props
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  if (required !== undefined && required !== 'atLeastOnce') {
    $attr = $attr.required(required)
  }

  if (hidden !== undefined && hidden) {
    $attr = $attr.hidden(hidden)
  }

  if (key !== undefined && key) {
    $attr = $attr.key(key)
  }

  if (savedAs !== undefined) {
    $attr = $attr.savedAs(savedAs)
  }

  return $attr
}
