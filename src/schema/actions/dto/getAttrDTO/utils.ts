import type { Attribute } from '~/attributes/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'

import type { IAttributeDTO } from '../schema/index.js'

export const getDefaultsDTO = (attr: Attribute): NonNullable<IAttributeDTO['defaults']> => {
  const defaultsDTO: NonNullable<IAttributeDTO['defaults']> = {}

  for (const mode of ['put', 'key', 'update'] as const) {
    const modeDefault = attr.defaults[mode]

    if (modeDefault === undefined) {
      continue
    }

    defaultsDTO[mode] = isFunction(modeDefault)
      ? { defaulterId: 'custom' }
      : { defaulterId: 'value', value: modeDefault }
  }

  return defaultsDTO
}
