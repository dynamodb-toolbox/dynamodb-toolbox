import type { $MapAttribute } from '~/attributes/map/index.js'
import { map } from '~/attributes/map/index.js'
import type { JSONizedAttr } from '~/schema/actions/jsonize/index.js'

import { fromJSONAttr } from './attribute.js'

type JSONizedMapAttr = Extract<JSONizedAttr, { type: 'map' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONMapAttr = ({
  defaults,
  links,
  attributes,
  ...props
}: JSONizedMapAttr): $MapAttribute => {
  defaults
  links

  return map(
    Object.fromEntries(
      Object.entries(attributes).map(([attributeName, attribute]) => [
        attributeName,
        fromJSONAttr(attribute)
      ])
    ),
    props
  )
}
