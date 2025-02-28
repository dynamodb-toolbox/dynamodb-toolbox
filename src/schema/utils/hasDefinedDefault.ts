import type { Schema } from '../types/index.js'

export const hasDefinedDefault = (schema: Schema): boolean =>
  (['keyDefault', 'putDefault', 'updateDefault', 'keyLink', 'putLink', 'updateLink'] as const).some(
    prop => schema.props[prop] !== undefined
  )
