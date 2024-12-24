import { anyOf } from '~/attributes/anyOf/index.js'
import type { $AnyOfAttribute, $AnyOfAttributeNestedState } from '~/attributes/anyOf/index.js'
import { ANY_OF_DEFAULT_OPTIONS } from '~/attributes/anyOf/options.js'
import type { $AnyOfAttributeElements } from '~/attributes/anyOf/types.js'
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
  let $attr = anyOf(...(elements.map(fromAttrDTO) as $AnyOfAttributeElements[])) as $AnyOfAttribute

  const { required, hidden, key, savedAs, defaults, links } = props
  defaults
  links

  if (required !== undefined && required !== ANY_OF_DEFAULT_OPTIONS.required) {
    $attr = $attr.required(required) as $AnyOfAttribute
  }

  if (hidden !== undefined && hidden !== ANY_OF_DEFAULT_OPTIONS.hidden) {
    $attr = $attr.hidden(hidden) as $AnyOfAttribute
  }

  if (key !== undefined && key !== ANY_OF_DEFAULT_OPTIONS.key) {
    $attr = $attr.key(key) as $AnyOfAttribute
  }

  if (savedAs !== undefined && savedAs !== ANY_OF_DEFAULT_OPTIONS.savedAs) {
    $attr = $attr.savedAs(savedAs) as $AnyOfAttribute
  }

  return $attr
}
