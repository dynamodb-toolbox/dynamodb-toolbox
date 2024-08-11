import { any } from '~/attributes/any/index.js'
import type { $AnyAttribute } from '~/attributes/any/index.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

type JSONizedAnyAttr = Extract<JSONizedAttr, { type: 'any' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONAnyAttr = ({ defaults, links, ...props }: JSONizedAnyAttr): $AnyAttribute => {
  defaults
  links

  return any(props)
}
