import type {
  $AnyOfAttribute,
  $AnyOfAttributeNestedState,
  AnyOfElementSchema
} from '~/attributes/anyOf/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAttrDTO } from './attribute.js'

type AnyOfAttrDTO = Extract<AttributeDTO, { type: 'anyOf' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONAnyOfAttr = ({
  elements,
  ...props
}: AnyOfAttrDTO): $AnyOfAttributeNestedState => {
  /**
   * @debt types "fix those casts"
   */
  let $attr = anyOf(...(elements.map(fromAttrDTO) as AnyOfElementSchema[])) as $AnyOfAttribute

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
    $attr = $attr.required(required) as $AnyOfAttribute
  }

  if (hidden !== undefined && hidden) {
    $attr = $attr.hidden(hidden) as $AnyOfAttribute
  }

  if (key !== undefined && key) {
    $attr = $attr.key(key) as $AnyOfAttribute
  }

  if (savedAs !== undefined) {
    $attr = $attr.savedAs(savedAs) as $AnyOfAttribute
  }

  return $attr
}
