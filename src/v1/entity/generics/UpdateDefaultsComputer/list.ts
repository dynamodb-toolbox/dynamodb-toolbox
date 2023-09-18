import type { ComputedDefault, ListAttribute } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { AttributeUpdateItemInput } from 'v1/commands/updateItem/types'

import type { AttributeUpdateDefaultsComputer } from './attribute'

export type ListAttributeUpdateDefaultsComputer<
  LIST_ATTRIBUTE extends ListAttribute,
  CONTEXT_INPUTS extends any[],
  SCHEMA_ATTRIBUTE_PATHS extends string = string,
  ELEMENTS_DEFAULT_COMPUTER = AttributeUpdateDefaultsComputer<
    LIST_ATTRIBUTE['elements'],
    [number, ...CONTEXT_INPUTS],
    SCHEMA_ATTRIBUTE_PATHS
  >,
  LIST_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _list: LIST_ATTRIBUTE extends { defaults: { update: ComputedDefault } }
      ? (
          ...contextInputs: CONTEXT_INPUTS
        ) => AttributeUpdateItemInput<LIST_ATTRIBUTE, false, SCHEMA_ATTRIBUTE_PATHS>
      : undefined
    _elements: ELEMENTS_DEFAULT_COMPUTER extends undefined
      ? undefined
      : ELEMENTS_DEFAULT_COMPUTER extends { _elements: unknown }
      ? ELEMENTS_DEFAULT_COMPUTER['_elements']
      : ELEMENTS_DEFAULT_COMPUTER extends { _attributes: unknown }
      ? ELEMENTS_DEFAULT_COMPUTER['_attributes']
      : never
  }>
> = keyof LIST_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : LIST_ATTRIBUTE_DEFAULT_COMPUTER extends { _list: unknown; _elements?: undefined }
  ? LIST_ATTRIBUTE_DEFAULT_COMPUTER['_list']
  : { [KEY in keyof LIST_ATTRIBUTE_DEFAULT_COMPUTER]: LIST_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
