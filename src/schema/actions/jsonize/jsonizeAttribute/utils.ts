import type { Attribute } from '~/attributes/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'

import type { JSONizedAttr } from '../schema/index.js'

export const jsonizeDefaults = (attr: Attribute): NonNullable<JSONizedAttr['defaults']> => {
  const jsonizedDefaults: NonNullable<JSONizedAttr['defaults']> = {}

  for (const mode of ['put', 'key', 'update'] as const) {
    const modeDefault = attr.defaults[mode]

    if (modeDefault === undefined) {
      continue
    }

    jsonizedDefaults[mode] = isFunction(modeDefault)
      ? { defaulterId: 'custom' }
      : { defaulterId: 'value', value: modeDefault }
  }

  return jsonizedDefaults
}
