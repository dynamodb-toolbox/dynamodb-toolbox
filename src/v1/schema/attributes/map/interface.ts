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

import type { Schema } from '../../interface'
import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants'
import type { $type, $attributes } from '../constants/attributeOptions'
import type { SharedAttributeState, $SharedAttributeState } from '../shared/interface'

import type { FreezeMapAttribute } from './freeze'
import type { $MapAttributeAttributeStates, MapAttributeAttributes } from './types'

export interface $MapAttributeState<
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates,
  STATE extends SharedAttributeState = SharedAttributeState
> extends $SharedAttributeState<STATE> {
  [$type]: 'map'
  [$attributes]: $ATTRIBUTES
}

export interface $MapAttributeNestedState<
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates,
  STATE extends SharedAttributeState = SharedAttributeState
> extends $MapAttributeState<$ATTRIBUTES, STATE> {
  freeze: (path: string) => FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>
}

/**
 * MapAttribute attribute interface
 */
export interface $MapAttribute<
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates,
  STATE extends SharedAttributeState = SharedAttributeState
> extends $MapAttributeNestedState<$ATTRIBUTES, STATE> {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_REQUIRED
  ) => $MapAttribute<$ATTRIBUTES, O.Overwrite<STATE, { required: NEXT_REQUIRED }>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $MapAttribute<$ATTRIBUTES, O.Overwrite<STATE, { required: Never }>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: <NEXT_HIDDEN extends boolean = true>(
    nextHidden?: NEXT_HIDDEN
  ) => $MapAttribute<$ATTRIBUTES, O.Overwrite<STATE, { hidden: NEXT_HIDDEN }>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $MapAttribute<$ATTRIBUTES, O.Overwrite<STATE, { required: Always; key: true }>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $MapAttribute<$ATTRIBUTES, O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault: (
    nextKeyDefault: ValueOrGetter<
      AttributeKeyInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
    >
  ) => $MapAttribute<
    $ATTRIBUTES,
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
      AttributePutItemInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
    >
  ) => $MapAttribute<
    $ATTRIBUTES,
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
      AttributeUpdateItemInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
    >
  ) => $MapAttribute<
    $ATTRIBUTES,
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
        AttributeKeyInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>,
        AttributePutItemInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
      >
    >
  ) => $MapAttribute<
    $ATTRIBUTES,
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
    ) => AttributeKeyInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
  ) => $MapAttribute<
    $ATTRIBUTES,
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
    ) => AttributePutItemInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
  ) => $MapAttribute<
    $ATTRIBUTES,
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
    ) => AttributeUpdateItemInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
  ) => $MapAttribute<
    $ATTRIBUTES,
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
      AttributeKeyInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>,
      AttributePutItemInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, true>
    >
  ) => $MapAttribute<
    $ATTRIBUTES,
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

export interface MapAttribute<
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes,
  STATE extends SharedAttributeState = SharedAttributeState
> extends SharedAttributeState<STATE> {
  path: string
  type: 'map'
  attributes: ATTRIBUTES
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
}
