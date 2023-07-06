import { $defaults } from '../constants/attributeOptions'
import type { $Attribute } from '../types'

export const hasDefinedDefault = (attribute: $Attribute): boolean =>
  (['key', 'put', 'update'] as const).some(
    operation => attribute[$defaults][operation] !== undefined
  )
