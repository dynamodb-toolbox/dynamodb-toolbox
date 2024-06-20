import { $defaults, $links } from '../constants/attributeOptions.js'
import type { $AttributeState } from '../types/index.js'

export const hasDefinedDefault = (attribute: $AttributeState): boolean =>
  (['key', 'put', 'update'] as const).some(
    mode => attribute[$defaults][mode] !== undefined || attribute[$links][mode] !== undefined
  )
