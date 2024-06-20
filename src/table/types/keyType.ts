/**
 * Possible Table Key or Index attribute type
 */
export type IndexableKeyType = 'string' | 'binary' | 'number'

/**
 * Returns the corresponding TS type of a Key or Index attribute type
 *
 * @param KEY_TYPE Attribute Type
 * @return Type
 */
export type ResolveIndexableKeyType<KEY_TYPE extends IndexableKeyType> = KEY_TYPE extends 'string'
  ? string
  : KEY_TYPE extends 'number'
  ? number
  : KEY_TYPE extends 'binary'
  ? Buffer
  : never
