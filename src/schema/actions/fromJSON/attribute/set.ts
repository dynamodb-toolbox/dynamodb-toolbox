import type { $SetAttribute } from '~/attributes/set/index.js'
import { set } from '~/attributes/set/index.js'
import type { $SetAttributeElements } from '~/attributes/set/types.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

import { fromJSONAttr } from './attribute.js'

type JSONizedSetAttr = Extract<JSONizedAttr, { type: 'set' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONSetAttr = ({
  defaults,
  links,
  elements,
  ...props
}: JSONizedSetAttr): $SetAttribute => {
  defaults
  links

  return set(fromJSONAttr(elements) as $SetAttributeElements, props)
}
