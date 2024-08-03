import type { IndexableKeyType } from './keyType.js'

/**
 * Define a partition or sort key of a Table or Table index
 * @param KEY_NAME Key attribute name
 * @param KEY_TYPE Key value type
 * @returns Key
 */
export interface Key<
  KEY_NAME extends string = string,
  KEY_TYPE extends IndexableKeyType = IndexableKeyType
> {
  name: KEY_NAME
  type: KEY_TYPE
}
