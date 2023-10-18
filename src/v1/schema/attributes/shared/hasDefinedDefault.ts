import { $defaults } from '../constants/attributeOptions'
import type { $AttributeState } from '../types'

export const hasDefinedDefault = (attribute: $AttributeState): boolean =>
  (['key', 'put', 'update'] as const).some(
    operation => attribute[$defaults][operation] !== undefined
  )
