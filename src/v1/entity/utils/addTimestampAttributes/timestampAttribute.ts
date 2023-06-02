import type { AtLeastOnce, PrimitiveAttribute } from 'v1/schema'

export type TimestampAttribute<SAVED_AS extends string> = PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: false
    key: false
    savedAs: SAVED_AS
    enum: undefined
    default: () => string
  }
>
