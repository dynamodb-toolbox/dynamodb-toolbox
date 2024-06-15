import type { O } from 'ts-toolbelt'

import type { If, ValueOrGetter } from 'v1/types'
// TODO: Remove this import
import type {
  AttributeUpdateItemInput,
  UpdateItemInput
} from 'v1/entity/actions/commands/updateItem/types'
import type { ParserInput } from 'v1/schema/actions/tParse'

import type { Schema } from '../../schema'
import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants/requiredOptions'
import type { $type, $castAs } from '../constants/attributeOptions'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'

import type { FreezeAnyAttribute } from './freeze'
import type { AnyAttributeState } from './types'

export interface $AnyAttributeState<STATE extends AnyAttributeState = AnyAttributeState>
  extends $SharedAttributeState<STATE> {
  [$type]: 'any'
  [$castAs]: STATE['castAs']
}

export interface $AnyAttributeNestedState<STATE extends AnyAttributeState = AnyAttributeState>
  extends $AnyAttributeState<STATE> {
  freeze: (path?: string) => FreezeAnyAttribute<$AnyAttributeState<STATE>>
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
  key: <NEXT_KEY extends boolean = true>(
    nextKey?: NEXT_KEY
  ) => $AnyAttribute<O.Overwrite<STATE, { key: NEXT_KEY; required: Always }>>
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
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>
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
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
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
        ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>,
        ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
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
      keyInput: ParserInput<SCHEMA, { mode: 'key'; fill: false }>
    ) => ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>
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
      putItemInput: ParserInput<SCHEMA, { fill: false }>
    ) => ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
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
      keyOrPutItemInput: If<
        STATE['key'],
        ParserInput<SCHEMA, { mode: 'key'; fill: false }>,
        ParserInput<SCHEMA, { fill: false }>
      >
    ) => If<
      STATE['key'],
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>,
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
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

export class AnyAttribute<STATE extends AnyAttributeState = AnyAttributeState>
  implements SharedAttributeState<STATE> {
  type: 'any'
  path?: string
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  defaults: STATE['defaults']
  links: STATE['links']
  castAs: STATE['castAs']

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'any'
    this.path = path
    this.required = state.required
    this.hidden = state.hidden
    this.key = state.key
    this.savedAs = state.savedAs
    this.defaults = state.defaults
    this.links = state.links
    this.castAs = state.castAs
  }

  // DO NOT DE-COMMENT right now as they trigger a ts(7056) error on even relatively small schemas
  // TODO: Find a way not to trigger this error
  // build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
  //   schemaAction: new (schema: this) => SCHEMA_ACTION
  // ): SCHEMA_ACTION {
  //   return new schemaAction(this)
  // }
}
