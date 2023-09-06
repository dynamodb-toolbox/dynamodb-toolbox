import type { AtLeastOnce, PrimitiveAttribute } from 'v1/schema'

export type TimestampAttribute<
  SAVED_AS extends string,
  HIDDEN extends boolean,
  UPDATE_DEFAULT extends string | (() => string) | undefined = undefined
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
      put: () => string
      update: UPDATE_DEFAULT
    }
  }
>
