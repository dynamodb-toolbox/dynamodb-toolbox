import type { O } from 'ts-toolbelt'

import type { If, ValueOrGetter } from 'v1/types'
import type {
  AttributeKeyInput,
  AttributePutItemInput,
  AttributeUpdateItemInput,
  KeyInput,
  PutItemInput,
  UpdateItemInput
} from 'v1/commands'

import type { Schema } from '../../interface'
import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants'
import type { $type, $elements } from '../constants/attributeOptions'
import type {
  $SharedAttributeState,
  SharedAttributeState,
  SharedAttributeStateConstraint
} from '../shared/interface'

import type { FreezeListAttribute } from './freeze'
import type { $ListAttributeElements, ListAttributeElements } from './types'

export interface $ListAttributeState<
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
> extends $SharedAttributeState<STATE> {
  [$type]: 'list'
  [$elements]: $ELEMENTS
}

/**
 * List attribute interface
 */
export interface $ListAttribute<
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
> extends $ListAttributeState<$ELEMENTS, STATE> {
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
  ) => $ListAttribute<$ELEMENTS, O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $ListAttribute<$ELEMENTS, O.Overwrite<STATE, { required: Never }>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $ListAttribute<$ELEMENTS, O.Overwrite<STATE, { hidden: true }>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $ListAttribute<$ELEMENTS, O.Overwrite<STATE, { required: Always; key: true }>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $ListAttribute<$ELEMENTS, O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault: (
    nextKeyDefault: ValueOrGetter<
      AttributeKeyInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $ListAttribute<
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
      AttributePutItemInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $ListAttribute<
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
      AttributeUpdateItemInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>
    >
  ) => $ListAttribute<
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
        AttributeKeyInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>,
        AttributePutItemInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>
      >
    >
  ) => $ListAttribute<
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
   * @param nextKeyDefault `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink: <SCHEMA extends Schema>(
    nextKeyDefault: ValueOrGetter<
      AttributeKeyInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>,
      [KeyInput<SCHEMA, true>]
    >
  ) => $ListAttribute<
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
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink: <SCHEMA extends Schema>(
    nextPutDefault: ValueOrGetter<
      AttributePutItemInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>,
      [PutItemInput<SCHEMA, true>]
    >
  ) => $ListAttribute<
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
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink: <SCHEMA extends Schema>(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>,
      [UpdateItemInput<SCHEMA, true>]
    >
  ) => $ListAttribute<
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
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link: <SCHEMA extends Schema>(
    nextDefault: ValueOrGetter<
      If<
        STATE['key'],
        AttributeKeyInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>,
        AttributePutItemInput<FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>, true>
      >,
      [If<STATE['key'], KeyInput<SCHEMA, true>, PutItemInput<SCHEMA, true>>]
    >
  ) => $ListAttribute<
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
}

export interface ListAttribute<
  ELEMENTS extends ListAttributeElements = ListAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
> extends SharedAttributeState<STATE> {
  path: string
  type: 'list'
  elements: ELEMENTS
}
