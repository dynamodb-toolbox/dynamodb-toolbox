import type { ArrayPath } from '~/schema/actions/utils/types.js'
import type { Paths, Schema } from '~/schema/index.js'

/**
 * Options driving how a value is formatted (projection, partial, reversal).
 */
export interface FormatValueOptions<SCHEMA extends Schema> {
  format?: boolean
  transform?: boolean
  attributes?: Paths<SCHEMA>[]
  partial?: boolean
}

/**
 * Format options carrying the current value path within the recursion.
 */
export interface FormatAttrValueOptions<SCHEMA extends Schema> extends FormatValueOptions<SCHEMA> {
  valuePath?: ArrayPath
}

/**
 * Derive the read-value options from user-provided format options.
 */
export interface InferReadValueOptions<
  SCHEMA extends Schema,
  OPTIONS extends FormatValueOptions<SCHEMA>
> {
  attributes: OPTIONS extends { attributes: string[] } ? OPTIONS['attributes'][number] : undefined
  partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : undefined
}
