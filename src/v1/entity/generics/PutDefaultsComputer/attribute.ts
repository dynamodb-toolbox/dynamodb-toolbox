import type {
  ComputedDefault,
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute
} from 'v1/schema'

import type { AttributePutItem } from '../PutItem'

import type { ListAttributePutDefaultsComputer } from './list'
import type { MapAttributePutDefaultsComputer } from './map'
import type { RecordAttributePutDefaultsComputer } from './record'

export type AttributePutDefaultsComputer<
  ATTRIBUTE extends Attribute,
  CONTEXT_INPUTS extends any[]
> = ATTRIBUTE extends (
  | AnyAttribute
  | PrimitiveAttribute
  | SetAttribute
  // TODO: Prevent nested ComputedDefaults in anyOf
  | AnyOfAttribute
) & { defaults: { put: ComputedDefault } }
  ? (...contextInputs: CONTEXT_INPUTS) => AttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends ListAttribute
  ? ListAttributePutDefaultsComputer<ATTRIBUTE, CONTEXT_INPUTS>
  : ATTRIBUTE extends MapAttribute
  ? MapAttributePutDefaultsComputer<ATTRIBUTE, CONTEXT_INPUTS>
  : ATTRIBUTE extends RecordAttribute
  ? RecordAttributePutDefaultsComputer<ATTRIBUTE, CONTEXT_INPUTS>
  : undefined
