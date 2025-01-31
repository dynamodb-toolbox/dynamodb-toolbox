import type { Attribute } from '~/attributes/index.js'
import type { SerializableTransformer } from '~/transformers/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { AttributeDTO } from '../types.js'

export const getDefaultsDTO = (attr: Attribute): NonNullable<AttributeDTO['defaults']> => {
  const defaultsDTO: NonNullable<AttributeDTO['defaults']> = {}

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

export const isTransformerWithDTO = (
  transformer: unknown
): transformer is SerializableTransformer =>
  isObject(transformer) && 'transformerId' in transformer && 'toJSON' in transformer
