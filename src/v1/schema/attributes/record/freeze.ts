import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { freezeAttribute, FreezeAttribute } from '../freeze'
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

import type { $RecordAttribute, RecordAttribute } from './interface'

export type FreezeRecordAttribute<$RECORD_ATTRIBUTE extends $RecordAttribute> =
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

type RecordAttributeFreezer = <$RECORD_ATTRIBUTE extends $RecordAttribute>(
  $recordAttribute: $RECORD_ATTRIBUTE,
  path: string
) => FreezeRecordAttribute<$RECORD_ATTRIBUTE>

/**
 * Freezes a list instance
 *
 * @param $recordAttribute List
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeRecordAttribute: RecordAttributeFreezer = <
  $RECORD_ATTRIBUTE extends $RecordAttribute
>(
  $recordAttribute: $RECORD_ATTRIBUTE,
  path: string
): FreezeRecordAttribute<$RECORD_ATTRIBUTE> => {
  validateAttributeProperties($recordAttribute, path)

  const keys: $RECORD_ATTRIBUTE[$keys] = $recordAttribute[$keys]

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

  const elements: $RECORD_ATTRIBUTE[$elements] = $recordAttribute[$elements]

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

  const frozenKeys = freezeAttribute(keys, `${path} (KEY)`)
  const frozenElements = freezeAttribute(elements, `${path}[string]`)

  return {
    path,
    type: $recordAttribute[$type],
    keys: frozenKeys,
    elements: frozenElements,
    required: $recordAttribute[$required],
    hidden: $recordAttribute[$hidden],
    key: $recordAttribute[$key],
    savedAs: $recordAttribute[$savedAs],
    defaults: $recordAttribute[$defaults]
  }
}
