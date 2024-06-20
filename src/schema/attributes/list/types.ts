import type {
  $defaults,
  $hidden,
  $links,
  $required,
  $savedAs
} from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
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
