import type { Schema } from '../types/index.js'

/**
 * Whether a schema declares a default or link value.
 */
export const hasDefinedDefault = (schema: Schema): boolean =>
  (['keyDefault', 'putDefault', 'updateDefault', 'keyLink', 'putLink', 'updateLink'] as const).some(
    prop => schema.props[prop] !== undefined
  )
