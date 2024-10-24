import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

import { attrStateDTOAttributes } from './state.js'

export const anyAttrDTOSchema = map({
  type: string().const('any'),
  ...attrStateDTOAttributes
})
