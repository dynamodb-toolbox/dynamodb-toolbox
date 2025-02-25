import { DynamoDBToolboxError } from '~/errors/index.js'

import type { $elements, $keys } from '../constants/attributeOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $RecordAttributeState, RecordAttribute } from './interface.js'
import { RecordAttribute_ } from './interface.js'
import type { $RecordAttributeElements, $RecordAttributeKeys } from './types.js'

export type FreezeRecordAttribute<
  $RECORD_ATTRIBUTE extends $RecordAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? RecordAttribute_<
      $RECORD_ATTRIBUTE['state'],
      FreezeAttribute<$RECORD_ATTRIBUTE[$keys]>,
      FreezeAttribute<$RECORD_ATTRIBUTE[$elements]>
    >
  : RecordAttribute<
      $RECORD_ATTRIBUTE['state'],
      FreezeAttribute<$RECORD_ATTRIBUTE[$keys]>,
      FreezeAttribute<$RECORD_ATTRIBUTE[$elements]>
    >

type RecordAttributeFreezer = <
  STATE extends SharedAttributeState,
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements
>(
  state: STATE,
  keys: $KEYS,
  elements: $ELEMENTS,
  path?: string
) => FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>, true>

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
  STATE extends SharedAttributeState,
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements
>(
  state: STATE,
  keys: $KEYS,
  elements: $ELEMENTS,
  path?: string
) => {
  validateAttributeProperties(state, path)

  if (keys.type !== 'string') {
    throw new DynamoDBToolboxError('schema.recordAttribute.invalidKeys', {
      message: `Invalid record keys${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record keys must be a string.`,
      path
    })
  }

  const {
    required: keysRequired,
    hidden: keysHidden,
    key: keysKey,
    savedAs: keysSavedAs
  } = keys.state

  // Checking $key before $required as $key implies attribute is always $required
  if (keysKey !== undefined && keysKey !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.keyKeys', {
      message: `Invalid record keys${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record keys cannot be part of primary key.`,
      path
    })
  }

  if (keysRequired !== undefined && keysRequired !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('schema.recordAttribute.optionalKeys', {
      message: `Invalid record keys${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record keys must be required.`,
      path
    })
  }

  if (keysHidden !== undefined && keysHidden !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.hiddenKeys', {
      message: `Invalid record keys${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record keys cannot be hidden.`,
      path
    })
  }

  if (keysSavedAs !== undefined) {
    throw new DynamoDBToolboxError('schema.recordAttribute.savedAsKeys', {
      message: `Invalid record keys${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record keys cannot be renamed (have savedAs option).`,
      path
    })
  }

  if (hasDefinedDefault(keys)) {
    throw new DynamoDBToolboxError('schema.recordAttribute.defaultedKeys', {
      message: `Invalid record keys${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record keys cannot have default or linked values.`,
      path
    })
  }

  const {
    key: elementsKey,
    required: elementsRequired,
    hidden: elementsHidden,
    savedAs: elementsSavedAs
  } = elements.state

  // Checking $key before $required as $key implies attribute is always $required
  if (elementsKey !== undefined && elementsKey !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.keyElements', {
      message: `Invalid record elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record elements cannot be part of primary key.`,
      path
    })
  }

  if (elementsRequired !== undefined && elementsRequired !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('schema.recordAttribute.optionalElements', {
      message: `Invalid record elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record elements must be required.`,
      path
    })
  }

  if (elementsHidden !== undefined && elementsHidden !== false) {
    throw new DynamoDBToolboxError('schema.recordAttribute.hiddenElements', {
      message: `Invalid record elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record elements cannot be hidden.`,
      path
    })
  }

  if (elementsSavedAs !== undefined) {
    throw new DynamoDBToolboxError('schema.recordAttribute.savedAsElements', {
      message: `Invalid record elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Record elements cannot be renamed (have savedAs option).`,
      path
    })
  }

  if (hasDefinedDefault(elements)) {
    throw new DynamoDBToolboxError('schema.recordAttribute.defaultedElements', {
      message: `Invalid record elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Records elements cannot have default or linked values.`,
      path
    })
  }

  const frozenKeys = keys.freeze(path && `${path} (KEY)`) as FreezeAttribute<$KEYS, true>
  const frozenElements = elements.freeze(`${path ?? ''}[string]`) as FreezeAttribute<
    $ELEMENTS,
    true
  >

  return new RecordAttribute_({
    path,
    keys: frozenKeys,
    elements: frozenElements,
    ...state
  })
}
