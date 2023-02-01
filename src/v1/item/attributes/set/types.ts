import { AtLeastOnce } from '../constants'
import { $required, $hidden, $key, $savedAs, $enum, $default } from '../constants/attributeOptions'
import type { PrimitiveAttribute, $PrimitiveAttribute } from '../primitive/interface'
import { PrimitiveAttributeEnumValues } from '../primitive/types'

export type $SetAttributeElements = $PrimitiveAttribute<
  'string' | 'number' | 'binary',
  {
    [$required]: AtLeastOnce
    [$hidden]: false
    [$key]: boolean
    [$savedAs]: undefined
    [$enum]: PrimitiveAttributeEnumValues<'string' | 'number' | 'binary'>
    [$default]: undefined
  }
>

// TODO: Just use FreezeAttribute ?
export type SetAttributeElements = PrimitiveAttribute<
  'string' | 'number' | 'binary',
  {
    required: AtLeastOnce
    hidden: false
    key: boolean
    savedAs: undefined
    enum: PrimitiveAttributeEnumValues<'string' | 'number' | 'binary'>
    default: undefined
  }
>
