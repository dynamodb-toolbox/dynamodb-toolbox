import type { AttrSchema } from '~/attributes/index.js'
import type { SerializableTransformer } from '~/transformers/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { AttributeDTO } from '../types.js'

export const getDefaultsDTO = (
  attr: AttrSchema
): Pick<AttributeDTO, 'keyDefault' | 'putDefault' | 'updateDefault'> => {
  const defaultsDTO: Pick<AttributeDTO, 'keyDefault' | 'putDefault' | 'updateDefault'> = {}

  for (const mode of ['keyDefault', 'putDefault', 'updateDefault'] as const) {
    const modeDefault = attr.state[mode]

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
