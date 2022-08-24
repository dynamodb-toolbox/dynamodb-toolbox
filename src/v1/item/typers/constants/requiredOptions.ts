/**
 * Tag for optional properties
 */
export const Never = Symbol('Tag for optional properties')
/**
 * Tag for optional properties
 */
export type Never = typeof Never

/**
 * Tag for required at least once properties
 */
export const AtLeastOnce = Symbol('Tag for required at least once properties')
/**
 * Tag for required at least once properties
 */
export type AtLeastOnce = typeof AtLeastOnce

/**
 * Tag for required only once properties
 */
export const OnlyOnce = Symbol('Tag for required only once properties')
/**
 * Tag for required only once properties
 */
export type OnlyOnce = typeof OnlyOnce

/**
 * Tag for always required properties
 */
export const Always = Symbol('Tag for always required properties')
/**
 * Tag for always required properties
 */
export type Always = typeof Always

/**
 * Available options for properties required option
 */
export type RequiredOption = Never | AtLeastOnce | OnlyOnce | Always
