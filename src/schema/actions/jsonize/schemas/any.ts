import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonAttrOptionSchemas } from './common.js'

export const jsonAnyAttrSchema = map({
  type: string().const('any'),
  ...jsonAttrOptionSchemas
})
