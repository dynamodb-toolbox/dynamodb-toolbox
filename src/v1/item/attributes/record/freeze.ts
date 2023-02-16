import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { freezeAttribute, FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $keys,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
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
        default: $RECORD_ATTRIBUTE[$default]
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
 * @param path Path of the instance in the related item (string)
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
    throw new DynamoDBToolboxError('invalidRecordAttributeKeys', {
      message: `Invalid record keys at path ${path}: Record keys must be a string`,
      path
    })
  }

  if (keys[$required] !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('optionalRecordAttributeKeys', {
      message: `Invalid record keys at path ${path}: Record keys must be required`,
      path
    })
  }

  if (keys[$hidden] !== false) {
    throw new DynamoDBToolboxError('hiddenRecordAttributeKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot be hidden`,
      path
    })
  }

  if (keys[$key] !== false) {
    throw new DynamoDBToolboxError('keyRecordAttributeKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot be part of primary key`,
      path
    })
  }

  if (keys[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('savedAsRecordAttributeKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (keys[$default] !== undefined) {
    throw new DynamoDBToolboxError('defaultedRecordAttributeKeys', {
      message: `Invalid record keys at path ${path}: Record keys cannot have default values`,
      path
    })
  }

  const elements: $RECORD_ATTRIBUTE[$elements] = $recordAttribute[$elements]

  if (elements[$required] !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('optionalRecordAttributeElements', {
      message: `Invalid record elements at path ${path}: Record elements must be required`,
      path
    })
  }

  if (elements[$hidden] !== false) {
    throw new DynamoDBToolboxError('hiddenRecordAttributeElements', {
      message: `Invalid record elements at path ${path}: Record elements cannot be hidden`,
      path
    })
  }

  if (elements[$key] !== false) {
    throw new DynamoDBToolboxError('keyRecordAttributeElements', {
      message: `Invalid record elements at path ${path}: Record elements cannot be part of primary key`,
      path
    })
  }

  if (elements[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('savedAsRecordAttributeElements', {
      message: `Invalid record elements at path ${path}: Record elements cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (elements[$default] !== undefined) {
    throw new DynamoDBToolboxError('defaultedRecordAttributeElements', {
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
    default: $recordAttribute[$default]
  }
}
