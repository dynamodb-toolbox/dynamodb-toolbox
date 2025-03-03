interface TimestampObjectOptions {
  name?: string
  savedAs?: string
  hidden?: boolean
}

export interface TimestampsObjectOptions {
  created: boolean | TimestampObjectOptions
  modified: boolean | TimestampObjectOptions
}

export type TimestampsOptions = boolean | TimestampsObjectOptions

export interface TimestampsDefaultOptions {
  created: { name: 'created'; savedAs: '_ct'; hidden: false }
  modified: { name: 'modified'; savedAs: '_md'; hidden: false }
}

export interface EntityAttrObjectOptions {
  name?: string
  hidden?: boolean
}

export type EntityAttrOptions = boolean | EntityAttrObjectOptions

export interface EntityAttrDefaultOptions {
  name: 'entity'
  hidden: true
}

export type NarrowOptions<OPTIONS> =
  | (OPTIONS extends boolean | string ? OPTIONS : never)
  | { [KEY in keyof OPTIONS]: NarrowOptions<OPTIONS[KEY]> }
