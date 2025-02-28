import type { AttrSchema } from '~/attributes/index.js'
import type { SerializableTransformer } from '~/transformers/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { ISchemaDTO } from '../types.js'

export const getDefaultsDTO = (
  schema: AttrSchema
): Pick<ISchemaDTO, 'keyDefault' | 'putDefault' | 'updateDefault'> => {
  const defaultsDTO: Pick<ISchemaDTO, 'keyDefault' | 'putDefault' | 'updateDefault'> = {}

  for (const mode of ['keyDefault', 'putDefault', 'updateDefault'] as const) {
    const modeDefault = schema.props[mode]

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
