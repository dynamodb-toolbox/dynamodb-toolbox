import type { ComputedDefault, RecordAttribute } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { AttributePutItemInput } from 'v1/commands/putItem/types'

import type { AttributePutDefaultsComputer } from './attribute'

export type RecordAttributePutDefaultsComputer<
  RECORD_ATTRIBUTE extends RecordAttribute,
  CONTEXT_INPUTS extends any[],
  ELEMENTS_DEFAULT_COMPUTER = AttributePutDefaultsComputer<
    RECORD_ATTRIBUTE['elements'],
    [AttributePutItemInput<RECORD_ATTRIBUTE['keys']>, ...CONTEXT_INPUTS]
  >,
  RECORD_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _record: RECORD_ATTRIBUTE extends { defaults: { put: ComputedDefault } }
      ? (...contextInputs: CONTEXT_INPUTS) => AttributePutItemInput<RECORD_ATTRIBUTE, 'all'>
      : undefined
    _elements: ELEMENTS_DEFAULT_COMPUTER extends undefined
      ? undefined
      : ELEMENTS_DEFAULT_COMPUTER extends { _elements: unknown }
      ? ELEMENTS_DEFAULT_COMPUTER['_elements']
      : ELEMENTS_DEFAULT_COMPUTER extends { _attributes: unknown }
      ? ELEMENTS_DEFAULT_COMPUTER['_attributes']
      : never
  }>
> = keyof RECORD_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : RECORD_ATTRIBUTE_DEFAULT_COMPUTER extends { _record: unknown; _elements?: undefined }
  ? RECORD_ATTRIBUTE_DEFAULT_COMPUTER['_record']
  : { [KEY in keyof RECORD_ATTRIBUTE_DEFAULT_COMPUTER]: RECORD_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
