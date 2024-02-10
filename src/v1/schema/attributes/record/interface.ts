import type { O } from 'ts-toolbelt'

import type { If, ValueOrGetter } from 'v1/types'
import type {
  AttributeKeyInput,
  AttributePutItemInput,
  AttributeUpdateItemInput,
  KeyInput,
  PutItemInput,
  UpdateItemInput
} from 'v1/operations'

import type { Schema } from '../../schema'
import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants'
import type { $type, $elements, $keys } from '../constants/attributeOptions'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'
import type {
  $RecordAttributeKeys,
  RecordAttributeKeys,
  $RecordAttributeElements,
  RecordAttributeElements
} from './types'
import type { FreezeRecordAttribute } from './freeze'

export interface $RecordAttributeState<
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
> extends $SharedAttributeState<STATE> {
  [$type]: 'record'
  [$keys]: $KEYS
  [$elements]: $ELEMENTS
}

export interface $RecordAttributeNestedState<
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
> extends $RecordAttributeState<$KEYS, $ELEMENTS, STATE> {
  freeze: (path: string) => FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>
}

/**
 * Record attribute interface
 */
export interface $RecordAttribute<
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
> extends $RecordAttributeNestedState<$KEYS, $ELEMENTS, STATE> {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Overwrite<STATE, { required: Never }>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Overwrite<STATE, { hidden: true }>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Overwrite<STATE, { key: true; required: Always }>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault: (
    nextKeyDefault: ValueOrGetter<
      AttributeKeyInput<FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>, true>
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        defaults: {
          key: unknown
          put: STATE['defaults']['put']
          update: STATE['defaults']['update']
        }
      }
    >
  >
  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault: (
    nextPutDefault: ValueOrGetter<
      AttributePutItemInput<
        FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
        true
      >
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: unknown
          update: STATE['defaults']['update']
        }
      }
    >
  >
  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault: (
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<
        FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
        true
      >
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: STATE['defaults']['put']
          update: unknown
        }
      }
    >
  >
  /**
   * Provide a default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  default: (
    nextDefault: ValueOrGetter<
      If<
        STATE['key'],
        AttributeKeyInput<
          FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
          true
        >,
        AttributePutItemInput<
          FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
          true
        >
      >
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        defaults: If<
          STATE['key'],
          {
            key: unknown
            put: STATE['defaults']['put']
            update: STATE['defaults']['update']
          },
          {
            key: STATE['defaults']['key']
            put: unknown
            update: STATE['defaults']['update']
          }
        >
      }
    >
  >
  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink: <SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: KeyInput<SCHEMA, true>
    ) => AttributeKeyInput<
      FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
      true
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        links: {
          key: unknown
          put: STATE['links']['put']
          update: STATE['links']['update']
        }
      }
    >
  >
  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink: <SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: PutItemInput<SCHEMA, true>
    ) => AttributePutItemInput<
      FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
      true
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: unknown
          update: STATE['links']['update']
        }
      }
    >
  >
  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink: <SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<
      FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
      true
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: STATE['links']['put']
          update: unknown
        }
      }
    >
  >
  /**
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextLink `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link: <SCHEMA extends Schema>(
    nextLink: (
      keyOrPutItemInput: If<STATE['key'], KeyInput<SCHEMA, true>, PutItemInput<SCHEMA, true>>
    ) => If<
      STATE['key'],
      AttributeKeyInput<
        FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
        true
      >,
      AttributePutItemInput<
        FreezeRecordAttribute<$RecordAttributeState<$KEYS, $ELEMENTS, STATE>>,
        true
      >
    >
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Overwrite<
      STATE,
      {
        links: If<
          STATE['key'],
          {
            key: unknown
            put: STATE['links']['put']
            update: STATE['links']['update']
          },
          {
            key: STATE['links']['key']
            put: unknown
            update: STATE['links']['update']
          }
        >
      }
    >
  >
}

export interface RecordAttribute<
  KEYS extends RecordAttributeKeys = RecordAttributeKeys,
  ELEMENTS extends RecordAttributeElements = RecordAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
> extends SharedAttributeState<STATE> {
  path: string
  type: 'record'
  keys: KEYS
  elements: ELEMENTS
}
