interface TimestampObjectOptions {
  name?: string
  savedAs?: string
  hidden?: boolean
}

/** Fine-grained `timestamps` options, set independently for the `created` and `modified` attributes. */
export interface TimestampsObjectOptions {
  created: boolean | TimestampObjectOptions
  modified: boolean | TimestampObjectOptions
}

/** `timestamps` option of an `Entity`: a boolean, or per-timestamp options. */
export type TimestampsOptions = boolean | TimestampsObjectOptions

/** `timestamps` options applied when `timestamps` is `true`. */
export interface TimestampsDefaultOptions {
  created: { name: 'created'; savedAs: '_ct'; hidden: false }
  modified: { name: 'modified'; savedAs: '_md'; hidden: false }
}

/** Fine-grained `entityAttribute` options (name and visibility). */
export interface EntityAttrObjectOptions {
  name?: string
  hidden?: boolean
}

/** `entityAttribute` option of an `Entity`: a boolean, or fine-grained options. */
export type EntityAttrOptions = boolean | EntityAttrObjectOptions

/** `entityAttribute` options applied when `entityAttribute` is `true`. */
export interface EntityAttrDefaultOptions {
  name: 'entity'
  hidden: true
}

/** Preserve literal types of an options object through inference. */
export type NarrowOptions<OPTIONS> =
  | (OPTIONS extends boolean | string ? OPTIONS : never)
  | { [KEY in keyof OPTIONS]: NarrowOptions<OPTIONS[KEY]> }
