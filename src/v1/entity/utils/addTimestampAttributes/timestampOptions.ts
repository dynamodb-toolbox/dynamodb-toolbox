export type TimestampObjectOptions = { name: string; savedAs: string }

export type TimestampsObjectOptions = {
  created: boolean | TimestampObjectOptions
  modified: boolean | TimestampObjectOptions
}

export type TimestampsOptions = boolean | TimestampsObjectOptions

export type NarrowTimestampsOptions<TIMESTAMP_OPTIONS> =
  | (TIMESTAMP_OPTIONS extends boolean | string ? TIMESTAMP_OPTIONS : never)
  | {
      [K in keyof TIMESTAMP_OPTIONS]: NarrowTimestampsOptions<TIMESTAMP_OPTIONS[K]>
    }
