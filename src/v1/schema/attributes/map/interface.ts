import type { O } from 'ts-toolbelt'

import type { If, ValueOrGetter } from 'v1/types'
// TODO: Remove this import
import type {
  AttributeUpdateItemInput,
  UpdateItemInput
} from 'v1/entity/actions/commands/updateItem/types'
import type { ParserInput } from 'v1/schema/actions'

import type { Schema, SchemaAction } from '../../schema'
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
  freeze: (path?: string) => FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>
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
  hidden: () => $MapAttribute<$ATTRIBUTES, O.Overwrite<STATE, { hidden: true }>>
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
      ParserInput<
        FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>,
        { operation: 'key'; fill: false }
      >
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
      ParserInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, { fill: false }>
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
        ParserInput<
          FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>,
          { operation: 'key'; fill: false }
        >,
        ParserInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, { fill: false }>
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
      keyInput: ParserInput<SCHEMA, { operation: 'key'; fill: false }>
    ) => ParserInput<
      FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>,
      { operation: 'key'; fill: false }
    >
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
      putItemInput: ParserInput<SCHEMA, { fill: false }>
    ) => ParserInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, { fill: false }>
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
      keyOrPutItemInput: If<
        STATE['key'],
        ParserInput<SCHEMA, { operation: 'key'; fill: false }>,
        ParserInput<SCHEMA, { fill: false }>
      >
    ) => If<
      STATE['key'],
      ParserInput<
        FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>,
        { operation: 'key'; fill: false }
      >,
      ParserInput<FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>, { fill: false }>
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

export class MapAttribute<
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes,
  STATE extends SharedAttributeState = SharedAttributeState
> implements SharedAttributeState<STATE> {
  type: 'map'
  path?: string
  attributes: ATTRIBUTES
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  defaults: STATE['defaults']
  links: STATE['links']

  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>

  constructor({ path, attributes, ...state }: STATE & { path?: string; attributes: ATTRIBUTES }) {
    this.type = 'map'
    this.path = path
    this.attributes = attributes
    this.required = state.required
    this.hidden = state.hidden
    this.key = state.key
    this.savedAs = state.savedAs
    this.defaults = state.defaults
    this.links = state.links

    const keyAttributeNames = new Set<string>()
    const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    // TODO: Throw when duplicate attribute savedAs
    for (const attributeName in attributes) {
      const attribute = attributes[attributeName]

      if (attribute.key) {
        keyAttributeNames.add(attributeName)
      }

      requiredAttributeNames[attribute.required].add(attributeName)
    }

    this.keyAttributeNames = keyAttributeNames
    this.requiredAttributeNames = requiredAttributeNames
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
