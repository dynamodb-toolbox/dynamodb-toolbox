import { isObject } from '~/utils/validation/isObject.js'

import type { SerializableTransformer } from './transformer.js'

export const isSerializableTransformer = (
  transformer: unknown
): transformer is SerializableTransformer =>
  isObject(transformer) && 'transformerId' in transformer && 'toJSON' in transformer
