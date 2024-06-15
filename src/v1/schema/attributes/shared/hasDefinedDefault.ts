import { $defaults, $links } from '../constants/attributeOptions'
import type { $AttributeState } from '../types'

export const hasDefinedDefault = (attribute: $AttributeState): boolean =>
  (['key', 'put', 'update'] as const).some(
    mode => attribute[$defaults][mode] !== undefined || attribute[$links][mode] !== undefined
  )
