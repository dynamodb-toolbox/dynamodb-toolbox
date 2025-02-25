import { $state } from '../constants/attributeOptions.js'
import type { $AttributeState } from '../types/index.js'

export const hasDefinedDefault = (attribute: $AttributeState): boolean =>
  (['keyDefault', 'putDefault', 'updateDefault', 'keyLink', 'putLink', 'updateLink'] as const).some(
    prop => attribute[$state][prop] !== undefined
  )
