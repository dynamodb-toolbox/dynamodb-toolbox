import type { $Attribute, $AttributeState, Attribute } from '../types/attribute'

export interface $MapAttributeAttributes {
  [key: string]: $Attribute
}

export interface $MapAttributeAttributeStates {
  [key: string]: $AttributeState
}

export interface MapAttributeAttributes {
  [key: string]: Attribute
}
