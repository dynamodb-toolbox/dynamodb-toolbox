import type { AtLeastOnce } from '../constants'
import type { $required, $hidden, $savedAs, $defaults, $links } from '../constants/attributeOptions'
import type { $AttributeNestedState } from '../types'

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
