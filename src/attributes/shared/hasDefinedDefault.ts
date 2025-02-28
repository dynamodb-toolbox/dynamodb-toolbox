import type { AttrSchema } from '../types/index.js'

export const hasDefinedDefault = (schema: AttrSchema): boolean =>
  (['keyDefault', 'putDefault', 'updateDefault', 'keyLink', 'putLink', 'updateLink'] as const).some(
    prop => schema.props[prop] !== undefined
  )
