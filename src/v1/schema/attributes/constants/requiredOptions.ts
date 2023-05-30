/**
 * Tag for optional attributes
 */
export type Never = 'never'

/**
 * Tag for required at least once attributes
 */
export type AtLeastOnce = 'atLeastOnce'

/**
 * Tag for required only once attributes
 */
export type OnlyOnce = 'onlyOnce'

/**
 * Tag for always required attributes
 */
export type Always = 'always'

/**
 * Available options for attributes required option
 */
export type RequiredOption = Never | AtLeastOnce | OnlyOnce | Always

/**
 * Available options for attributes required options as Set
 */
export const requiredOptionsSet = new Set<RequiredOption>([
  'never',
  'atLeastOnce',
  'onlyOnce',
  'always'
])
