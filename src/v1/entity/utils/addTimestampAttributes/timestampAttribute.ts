import type { AtLeastOnce, PrimitiveAttribute } from 'v1/schema'

export type TimestampAttribute<
  SAVED_AS extends string,
  HIDDEN extends boolean
> = PrimitiveAttribute<
  'string',
  {
    required: AtLeastOnce
    hidden: HIDDEN
    key: false
    savedAs: SAVED_AS
    enum: undefined
    default: () => string
  }
>
