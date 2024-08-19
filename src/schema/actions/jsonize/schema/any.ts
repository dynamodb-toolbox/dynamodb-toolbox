import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonizedAttrOptionSchemas } from './common.js'

export const jsonizedAnyAttrSchema = map({
  type: string().const('any'),
  ...jsonizedAttrOptionSchemas
})
