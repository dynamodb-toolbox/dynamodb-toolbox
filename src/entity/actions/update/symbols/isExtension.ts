import { isObject } from '~/utils/validation/isObject.js'

export const $IS_EXTENSION = Symbol('$IS_EXTENSION')
export type $IS_EXTENSION = typeof $IS_EXTENSION

// Distinguishing verbal syntax vs non-verbal for type inference & parsing
export type Extension<VALUE> = { [$IS_EXTENSION]: true } & VALUE
export type Basic<VALUE> = { [$IS_EXTENSION]?: false } & VALUE

export const isExtension = (input: unknown): input is { [$IS_EXTENSION]: true } =>
  isObject(input) &&
  $IS_EXTENSION in input &&
  (input as { [$IS_EXTENSION]: unknown })[$IS_EXTENSION] === true
