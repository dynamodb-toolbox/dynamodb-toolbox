import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import type { AtLeastOnce, PrimitiveAttribute } from 'v1/schema'
import type { PrimitiveAttributeDefaultValue } from 'v1/schema/attributes/primitive/types'

export type TimestampAttribute<
  SAVED_AS extends string,
  HIDDEN extends boolean,
  UPDATE_DEFAULT extends PrimitiveAttributeDefaultValue<
    'string',
    undefined,
    UpdateItemInputExtension
  > = undefined
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
