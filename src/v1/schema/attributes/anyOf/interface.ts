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
import type { $type, $elements } from '../constants/attributeOptions'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'
import type { Attribute } from '../types'

import type { FreezeAnyOfAttribute } from './freeze'
import type { $AnyOfAttributeElements } from './types'
import type { ResolveAnyOfAttribute } from './resolve'

export interface $AnyOfAttributeState<
  $ELEMENTS extends $AnyOfAttributeElements[] = $AnyOfAttributeElements[],
  STATE extends SharedAttributeState = SharedAttributeState
> extends $SharedAttributeState<STATE> {
  [$type]: 'anyOf'
  [$elements]: $ELEMENTS
}

export interface $AnyOfAttributeNestedState<
  $ELEMENTS extends $AnyOfAttributeElements[] = $AnyOfAttributeElements[],
  STATE extends SharedAttributeState = SharedAttributeState
> extends $AnyOfAttributeState<$ELEMENTS, STATE> {
  freeze: (path: string) => FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>
}

/**
 * AnyOf attribute interface
 */
export interface $AnyOfAttribute<
  $ELEMENTS extends $AnyOfAttributeElements[] = $AnyOfAttributeElements[],
  STATE extends SharedAttributeState = SharedAttributeState
> extends $AnyOfAttributeNestedState<$ELEMENTS, STATE> {
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
  ) => $AnyOfAttribute<$ELEMENTS, O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $AnyOfAttribute<$ELEMENTS, O.Overwrite<STATE, { required: Never }>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: <NEXT_HIDDEN extends boolean = true>(
    nextHidden?: NEXT_HIDDEN
  ) => $AnyOfAttribute<$ELEMENTS, O.Overwrite<STATE, { hidden: NEXT_HIDDEN }>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $AnyOfAttribute<$ELEMENTS, O.Overwrite<STATE, { required: Always; key: true }>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $AnyOfAttribute<$ELEMENTS, O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault: (
    nextKeyDefault: ValueOrGetter<
      AttributeKeyInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $AnyOfAttribute<
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
      AttributePutItemInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $AnyOfAttribute<
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
      AttributeUpdateItemInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $AnyOfAttribute<
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
        AttributeKeyInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>,
        AttributePutItemInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
      >
    >
  ) => $AnyOfAttribute<
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
    ) => AttributeKeyInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
  ) => $AnyOfAttribute<
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
    ) => AttributePutItemInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
  ) => $AnyOfAttribute<
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
      FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>,
      true
    >
  ) => $AnyOfAttribute<
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
      AttributeKeyInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>,
      AttributePutItemInput<FreezeAnyOfAttribute<$AnyOfAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $AnyOfAttribute<
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

export interface AnyOfAttribute<
  ELEMENTS extends Attribute[] = Attribute[],
  STATE extends SharedAttributeState = SharedAttributeState
> extends SharedAttributeState<STATE> {
  path: string
  type: 'anyOf'
  elements: ELEMENTS
}

export interface MegaAnyOfAttribute<
  ELEMENTS extends Attribute[] = Attribute[],
  STATE extends SharedAttributeState = SharedAttributeState
> extends AnyOfAttribute<ELEMENTS, STATE> {
  parse: (input: unknown) => ResolveAnyOfAttribute<AnyOfAttribute<ELEMENTS, STATE>>
}
