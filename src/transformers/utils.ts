import { isObject } from '~/utils/validation/isObject.js'

import type { SerializableTransformer } from './transformer.js'

/**
 * Type guard checking whether a value is a `SerializableTransformer`.
 */
export const isSerializableTransformer = (
  transformer: unknown
): transformer is SerializableTransformer =>
  isObject(transformer) && 'transformerId' in transformer && 'toJSON' in transformer
