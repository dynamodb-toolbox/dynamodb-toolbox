import type { ComputedDefault, RecordAttribute } from 'v1/schema'
import type { OmitUndefinedProperties } from 'v1/types'
import type { AttributeUpdateItemInput } from 'v1/commands/updateItem/types'

import type { AttributeUpdateDefaultsComputer } from './attribute'

export type RecordAttributeUpdateDefaultsComputer<
  RECORD_ATTRIBUTE extends RecordAttribute,
  CONTEXT_INPUTS extends any[],
  SCHEMA_ATTRIBUTE_PATHS extends string,
  ELEMENTS_DEFAULT_COMPUTER = AttributeUpdateDefaultsComputer<
    RECORD_ATTRIBUTE['elements'],
    [
      AttributeUpdateItemInput<RECORD_ATTRIBUTE['keys'], 'independent', SCHEMA_ATTRIBUTE_PATHS>,
      ...CONTEXT_INPUTS
    ],
    SCHEMA_ATTRIBUTE_PATHS
  >,
  RECORD_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _record: RECORD_ATTRIBUTE extends { defaults: { update: ComputedDefault } }
      ? (
          ...contextInputs: CONTEXT_INPUTS
        ) => AttributeUpdateItemInput<RECORD_ATTRIBUTE['keys'], 'all', SCHEMA_ATTRIBUTE_PATHS>
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
