export type IndexableKeyType = 'string' | 'binary' | 'number'

export type ResolveIndexableKeyType<T extends IndexableKeyType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'binary'
  ? Buffer
  : never
