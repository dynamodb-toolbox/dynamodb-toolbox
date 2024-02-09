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
import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants/requiredOptions'
import type { $type, $castAs } from '../constants/attributeOptions'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'

import type { FreezeAnyAttribute } from './freeze'
import type { AnyAttributeState } from './types'
import type { ResolveAnyAttribute } from './resolve'

export interface $AnyAttributeState<STATE extends AnyAttributeState = AnyAttributeState>
  extends $SharedAttributeState<STATE> {
  [$type]: 'any'
  [$castAs]: STATE['castAs']
}

export interface $AnyAttributeNestedState<STATE extends AnyAttributeState = AnyAttributeState>
  extends $AnyAttributeState<STATE> {
  freeze: (path: string) => FreezeAnyAttribute<$AnyAttributeState<STATE>>
}

/**
 * Any attribute interface
 */
export interface $AnyAttribute<STATE extends AnyAttributeState = AnyAttributeState>
  extends $AnyAttributeNestedState<STATE> {
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
  ) => $AnyAttribute<O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $AnyAttribute<O.Overwrite<STATE, { required: Never }>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: <NEXT_HIDDEN extends boolean = true>(
    nextHidden?: NEXT_HIDDEN
  ) => $AnyAttribute<O.Overwrite<STATE, { hidden: NEXT_HIDDEN }>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $AnyAttribute<O.Overwrite<STATE, { required: Always; key: true }>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $AnyAttribute<O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>>
  /**
   * Cast attribute TS type
   */
  castAs: <NEXT_CAST_AS>(
    nextCastAs?: NEXT_CAST_AS
  ) => $AnyAttribute<O.Overwrite<STATE, { castAs: NEXT_CAST_AS }>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault: (
    nextKeyDefault: ValueOrGetter<
      AttributeKeyInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
    >
  ) => $AnyAttribute<
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
      AttributePutItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
    >
  ) => $AnyAttribute<
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
      AttributeUpdateItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
    >
  ) => $AnyAttribute<
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
        AttributeKeyInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>,
        AttributePutItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
      >
    >
  ) => $AnyAttribute<
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
    ) => AttributeKeyInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
  ) => $AnyAttribute<
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
    ) => AttributePutItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
  ) => $AnyAttribute<
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
    ) => AttributeUpdateItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
  ) => $AnyAttribute<
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
      AttributeKeyInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>,
      AttributePutItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
    >
  ) => $AnyAttribute<
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

export interface AnyAttribute<STATE extends AnyAttributeState = AnyAttributeState>
  extends SharedAttributeState<STATE> {
  path: string
  type: 'any'
  castAs: STATE['castAs']
}

export interface MegaAnyAttribute<STATE extends AnyAttributeState = AnyAttributeState>
  extends AnyAttribute<STATE> {
  parse: <OPTIONS extends { key?: boolean } = {}>(
    input: unknown,
    opts?: OPTIONS
  ) => ResolveAnyAttribute<
    AnyAttribute<STATE>,
    { key: OPTIONS['key'] extends boolean ? OPTIONS['key'] : false }
  >
}
