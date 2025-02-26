import type { AttrSchema } from '../types/index.js'

export const hasDefinedDefault = (attribute: AttrSchema): boolean =>
  (['keyDefault', 'putDefault', 'updateDefault', 'keyLink', 'putLink', 'updateLink'] as const).some(
    prop => attribute.props[prop] !== undefined
  )
