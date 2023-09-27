import type { ComputedDefault, MapAttribute } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { AttributePutItemInput } from 'v1/commands/putItem/types'

import type { AttributePutDefaultsComputer } from './attribute'

export type MapAttributePutDefaultsComputer<
  MAP_ATTRIBUTE extends MapAttribute,
  CONTEXT_INPUTS extends any[],
  ATTRIBUTES_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof MAP_ATTRIBUTE['attributes']]: AttributePutDefaultsComputer<
        MAP_ATTRIBUTE['attributes'][KEY],
        [AttributePutItemInput<MAP_ATTRIBUTE, 'independent'>, ...CONTEXT_INPUTS]
      >
    }
  >,
  MAP_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _attributes: keyof ATTRIBUTES_DEFAULT_COMPUTERS extends never
      ? undefined
      : {
          [KEY in keyof ATTRIBUTES_DEFAULT_COMPUTERS]: ATTRIBUTES_DEFAULT_COMPUTERS[KEY]
        }
    _map: MAP_ATTRIBUTE extends { defaults: { put: ComputedDefault } }
      ? (...contextInputs: CONTEXT_INPUTS) => AttributePutItemInput<MAP_ATTRIBUTE, 'all'>
      : undefined
  }>
> = keyof MAP_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : MAP_ATTRIBUTE_DEFAULT_COMPUTER extends { _map: unknown; _attributes?: undefined }
  ? MAP_ATTRIBUTE_DEFAULT_COMPUTER['_map']
  : { [KEY in keyof MAP_ATTRIBUTE_DEFAULT_COMPUTER]: MAP_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
