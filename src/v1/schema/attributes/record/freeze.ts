import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import type { FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import { hasDefinedDefault } from '../shared/hasDefinedDefault'
import {
  $type,
  $keys,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import type { SharedAttributeState } from '../shared/interface'
import type { $RecordAttributeState, RecordAttribute } from './interface'
import type { $RecordAttributeElements, $RecordAttributeKeys } from './types'

export type FreezeRecordAttribute<$RECORD_ATTRIBUTE extends $RecordAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    RecordAttribute<
      FreezeAttribute<$RECORD_ATTRIBUTE[$keys]>,
      FreezeAttribute<$RECORD_ATTRIBUTE[$elements]>,
      {
        required: $RECORD_ATTRIBUTE[$required]
        hidden: $RECORD_ATTRIBUTE[$hidden]
        key: $RECORD_ATTRIBUTE[$key]
        savedAs: $RECORD_ATTRIBUTE[$savedAs]
        defaults: $RECORD_ATTRIBUTE[$defaults]
      }
    >,
    never,
    never
  >

type RecordAttributeFreezer = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeState
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state: STATE,
  path: string
) => FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>

/**
 * Freezes a warm `record` attribute
 *
 * @param keys Attribute keys
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeRecordAttribute: RecordAttributeFreezer = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeState
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state: STATE,
  path: string
): FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>> => {
  validateAttributeProperties(state, path)

  if (keys[$type] !== 'string') {
    throw new DynamoDBToolboxError('schema.recordAttribute.invalidKeys', {
      message: `Invalid record keys at path ${path}: Record keys must be a string`,
      path
    })
  }

  // Checking $key before $required as $key implies attribute is always $required
  if (keys[$key] !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.keyKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot be part of primary key`,
      path
    })
  }

  if (keys[$required] !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('schema.recordAttribute.optionalKeys', {
      message: `Invalid record keys at path ${path}: Record keys must be required`,
      path
    })
  }

  if (keys[$hidden] !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.hiddenKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot be hidden`,
      path
    })
  }

  if (keys[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('schema.recordAttribute.savedAsKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (hasDefinedDefault(keys)) {
    throw new DynamoDBToolboxError('schema.recordAttribute.defaultedKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot have default values`,
      path
    })
  }

  // Checking $key before $required as $key implies attribute is always $required
  if (elements[$key] !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.keyElements', {
      message: `Invalid record elements at path ${path}: Record elements cannot be part of primary key`,
      path
    })
  }

  if (elements[$required] !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('schema.recordAttribute.optionalElements', {
      message: `Invalid record elements at path ${path}: Record elements must be required`,
      path
    })
  }

  if (elements[$hidden] !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.hiddenElements', {
      message: `Invalid record elements at path ${path}: Record elements cannot be hidden`,
      path
    })
  }

  if (elements[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('schema.recordAttribute.savedAsElements', {
      message: `Invalid record elements at path ${path}: Record elements cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (hasDefinedDefault(elements)) {
    throw new DynamoDBToolboxError('schema.recordAttribute.defaultedElements', {
      message: `Invalid record elements at path ${path}: Records elements cannot have default values`,
      path
    })
  }

  const frozenKeys = keys.freeze(`${path} (KEY)`) as FreezeAttribute<$KEYS>
  const frozenElements = elements.freeze(`${path}[string]`) as FreezeAttribute<$ELEMENTS>

  return {
    path,
    type: 'record',
    keys: frozenKeys,
    elements: frozenElements,
    ...state
  }
}
