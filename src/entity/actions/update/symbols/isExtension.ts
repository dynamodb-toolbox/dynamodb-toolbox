import { isObject } from '~/utils/validation/isObject.js'

export const $IS_EXTENSION = Symbol('$IS_EXTENSION')
/** Symbol key tagging an update input as an extension rather than a plain value. */
export type $IS_EXTENSION = typeof $IS_EXTENSION

// Distinguishing verbal syntax vs non-verbal for type inference & parsing
/** Value tagged as an update extension. */
export type Extended<VALUE> = { [$IS_EXTENSION]: true } & VALUE
/** Value explicitly not tagged as an update extension. */
export type Unextended<VALUE> = { [$IS_EXTENSION]?: false } & VALUE

/** Tell whether an update input is an extension. */
export const isExtension = (input: unknown): input is { [$IS_EXTENSION]: true } =>
  isObject(input) &&
  $IS_EXTENSION in input &&
  (input as { [$IS_EXTENSION]: unknown })[$IS_EXTENSION] === true
