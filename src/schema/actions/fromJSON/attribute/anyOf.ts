import { anyOf } from '~/attributes/anyOf/index.js'
import type { $AnyOfAttribute, $AnyOfAttributeNestedState } from '~/attributes/anyOf/index.js'
import { ANY_OF_DEFAULT_OPTIONS } from '~/attributes/anyOf/options.js'
import type { $AnyOfAttributeElements } from '~/attributes/anyOf/types.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

import { fromJSONAttr } from './attribute.js'

type JSONizedAnyOfAttr = Extract<JSONizedAttr, { type: 'anyOf' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONAnyOfAttr = ({
  elements,
  ...props
}: JSONizedAnyOfAttr): $AnyOfAttributeNestedState => {
  /**
   * @debt types "fix those casts"
   */
  let $attr = anyOf(...(elements.map(fromJSONAttr) as $AnyOfAttributeElements[])) as $AnyOfAttribute

  const { required, hidden, key, savedAs, defaults, links } = props
  defaults
  links

  if (required !== ANY_OF_DEFAULT_OPTIONS.required) {
    $attr = $attr.required(required) as $AnyOfAttribute
  }

  if (hidden !== ANY_OF_DEFAULT_OPTIONS.hidden) {
    $attr = $attr.hidden(hidden) as $AnyOfAttribute
  }

  if (key !== ANY_OF_DEFAULT_OPTIONS.key) {
    $attr = $attr.key(key) as $AnyOfAttribute
  }

  if (savedAs !== ANY_OF_DEFAULT_OPTIONS.savedAs) {
    $attr = $attr.savedAs(savedAs) as $AnyOfAttribute
  }

  return $attr
}
