import { $state } from '../constants/attributeOptions.js'
import type { $AttributeState } from '../types/index.js'

export const hasDefinedDefault = (attribute: $AttributeState): boolean =>
  (['key', 'put', 'update'] as const).some(
    mode =>
      attribute[$state].defaults[mode] !== undefined || attribute[$state].links[mode] !== undefined
  )
