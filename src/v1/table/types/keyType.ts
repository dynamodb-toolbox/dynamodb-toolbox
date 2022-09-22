/**
 * Possible Table Key or Index attribute type
 */
export type IndexableKeyType = 'string' | 'binary' | 'number'

/**
 * Returns the corresponding TS type of a Key or Index attribute type
 *
 * @param KeyType Attribute Type
 * @return Type
 */
export type ResolveIndexableKeyType<KeyType extends IndexableKeyType> = KeyType extends 'string'
  ? string
  : KeyType extends 'number'
  ? number
  : KeyType extends 'binary'
  ? Buffer
  : never
