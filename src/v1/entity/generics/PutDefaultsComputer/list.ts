import type { ComputedDefault, ListAttribute } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'

import type { AttributePutItemInput } from '../PutItemInput'

import type { AttributePutDefaultsComputer } from './attribute'

export type ListAttributePutDefaultsComputer<
  LIST_ATTRIBUTE extends ListAttribute,
  CONTEXT_INPUTS extends any[],
  ELEMENTS_DEFAULT_COMPUTER = AttributePutDefaultsComputer<
    LIST_ATTRIBUTE['elements'],
    [number, ...CONTEXT_INPUTS]
  >,
  LIST_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _list: LIST_ATTRIBUTE extends { defaults: { put: ComputedDefault } }
      ? (...contextInputs: CONTEXT_INPUTS) => AttributePutItemInput<LIST_ATTRIBUTE>
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
