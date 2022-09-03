/**
 * Tag for optional properties
 */
export type Never = 'never'

/**
 * Tag for required at least once properties
 */
export type AtLeastOnce = 'atLeastOnce'

/**
 * Tag for required only once properties
 */
export type OnlyOnce = 'onlyOnce'

/**
 * Tag for always required properties
 */
export type Always = 'always'

/**
 * Available options for properties required option
 */
export type RequiredOption = Never | AtLeastOnce | OnlyOnce | Always

/**
 * Available options for properties required options as Set
 */
export const requiredOptionsSet = new Set<RequiredOption>([
  'never',
  'atLeastOnce',
  'onlyOnce',
  'always'
])
