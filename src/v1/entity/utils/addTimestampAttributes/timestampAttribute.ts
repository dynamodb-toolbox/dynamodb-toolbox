import type { AtLeastOnce, PrimitiveAttribute } from 'v1/schema/attributes'

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
    defaults: {
      key: undefined
      put: unknown
      update: unknown
    }
    links: {
      key: undefined
      put: undefined
      update: undefined
    }
    transform: undefined
  }
>
