import type { ComputedDefault, MapAttribute } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { AttributeUpdateItemInput } from 'v1/commands/updateItem/types'

import type { AttributeUpdateDefaultsComputer } from './attribute'

export type MapAttributeUpdateDefaultsComputer<
  MAP_ATTRIBUTE extends MapAttribute,
  CONTEXT_INPUTS extends any[],
  SCHEMA_ATTRIBUTE_PATHS extends string,
  ATTRIBUTES_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof MAP_ATTRIBUTE['attributes']]: AttributeUpdateDefaultsComputer<
        MAP_ATTRIBUTE['attributes'][KEY],
        [
          AttributeUpdateItemInput<MAP_ATTRIBUTE, 'none', SCHEMA_ATTRIBUTE_PATHS>,
          ...CONTEXT_INPUTS
        ],
        SCHEMA_ATTRIBUTE_PATHS
      >
    }
  >,
  MAP_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _attributes: keyof ATTRIBUTES_DEFAULT_COMPUTERS extends never
      ? undefined
      : {
          [KEY in keyof ATTRIBUTES_DEFAULT_COMPUTERS]: ATTRIBUTES_DEFAULT_COMPUTERS[KEY]
        }
    _map: MAP_ATTRIBUTE extends { defaults: { update: ComputedDefault } }
      ? (
          ...contextInputs: CONTEXT_INPUTS
        ) => AttributeUpdateItemInput<MAP_ATTRIBUTE, 'all', SCHEMA_ATTRIBUTE_PATHS>
      : undefined
  }>
> = keyof MAP_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : MAP_ATTRIBUTE_DEFAULT_COMPUTER extends { _map: unknown; _attributes?: undefined }
  ? MAP_ATTRIBUTE_DEFAULT_COMPUTER['_map']
  : { [KEY in keyof MAP_ATTRIBUTE_DEFAULT_COMPUTER]: MAP_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
