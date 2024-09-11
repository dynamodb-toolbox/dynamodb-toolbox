import type { $ListAttributeNestedState } from '~/attributes/list/index.js'
import { list } from '~/attributes/list/index.js'
import type { $ListAttributeElements } from '~/attributes/list/types.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

import { fromJSONAttr } from './attribute.js'

type JSONizedListAttr = Extract<JSONizedAttr, { type: 'list' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONListAttr = ({
  defaults,
  links,
  elements,
  ...props
}: JSONizedListAttr): $ListAttributeNestedState => {
  defaults
  links

  return list(fromJSONAttr(elements) as $ListAttributeElements, props)
}
