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
import type { AttributeUpdateItemInput } from 'v1/commands/updateItem/types'

import type { ListAttributeUpdateDefaultsComputer } from './list'
import type { MapAttributeUpdateDefaultsComputer } from './map'
import type { RecordAttributeUpdateDefaultsComputer } from './record'

export type AttributeUpdateDefaultsComputer<
  ATTRIBUTE extends Attribute,
  CONTEXT_INPUTS extends any[],
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = ATTRIBUTE extends (
  | AnyAttribute
  | PrimitiveAttribute
  | SetAttribute
  // TODO: Prevent nested ComputedDefaults in anyOf
  | AnyOfAttribute
) & { defaults: { update: ComputedDefault } }
  ? (
      ...contextInputs: CONTEXT_INPUTS
    ) => AttributeUpdateItemInput<ATTRIBUTE, 'all', SCHEMA_ATTRIBUTE_PATHS>
  : ATTRIBUTE extends ListAttribute
  ? ListAttributeUpdateDefaultsComputer<ATTRIBUTE, CONTEXT_INPUTS, SCHEMA_ATTRIBUTE_PATHS>
  : ATTRIBUTE extends MapAttribute
  ? MapAttributeUpdateDefaultsComputer<ATTRIBUTE, CONTEXT_INPUTS, SCHEMA_ATTRIBUTE_PATHS>
  : ATTRIBUTE extends RecordAttribute
  ? RecordAttributeUpdateDefaultsComputer<ATTRIBUTE, CONTEXT_INPUTS, SCHEMA_ATTRIBUTE_PATHS>
  : undefined
