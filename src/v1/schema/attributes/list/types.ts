import type { AtLeastOnce } from '../constants/index.js'
import type {
  $required,
  $hidden,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions.js'
import type { $AttributeNestedState } from '../types/index.js'

export type $ListAttributeElements = $AttributeNestedState & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$savedAs]: undefined
  [$defaults]: {
    key: undefined
    put: undefined
    update: undefined
  }
  [$links]: {
    key: undefined
    put: undefined
    update: undefined
  }
}
