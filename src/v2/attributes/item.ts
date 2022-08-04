import { MappedProperties } from './property'
import { Narrow } from './utility'

export interface Item<P extends MappedProperties = MappedProperties> {
  _properties: P
}

type ItemTyper = <P extends MappedProperties>(_properties: Narrow<P>) => Item<P>

export const item = (_properties => ({ _properties })) as ItemTyper
