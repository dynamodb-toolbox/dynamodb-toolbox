type TimestampObjectOptions = {
  name?: string
  savedAs?: string
  hidden?: boolean
}

type TimestampsObjectOptions = {
  created: boolean | TimestampObjectOptions
  modified: boolean | TimestampObjectOptions
}

export type TimestampsOptions = boolean | TimestampsObjectOptions

export type NarrowTimestampsOptions<TIMESTAMP_OPTIONS> =
  | (TIMESTAMP_OPTIONS extends boolean | string ? TIMESTAMP_OPTIONS : never)
  | {
      [KEY in keyof TIMESTAMP_OPTIONS]: NarrowTimestampsOptions<TIMESTAMP_OPTIONS[KEY]>
    }

export type TimestampsDefaultOptions = {
  created: {
    name: 'created'
    savedAs: '_ct'
    hidden: false
  }
  modified: {
    name: 'modified'
    savedAs: '_md'
    hidden: false
  }
}
