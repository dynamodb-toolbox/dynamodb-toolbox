/**
 * Possible Table Key or Index attribute type
 */
export type IndexableKeyType = 'string' | 'binary' | 'number'

/**
 * Returns the corresponding TS type of a Key or Index attribute type
 *
 * @param T Attribute Type
 * @return Type
 */
export type ResolveIndexableKeyType<T extends IndexableKeyType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'binary'
  ? Buffer
  : never
