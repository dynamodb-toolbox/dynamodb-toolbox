import type { O } from 'ts-toolbelt'

import type { If, ValueOrGetter } from 'v1/types'
// TODO: Remove this import
import type {
  AttributeUpdateItemInput,
  UpdateItemInput
} from 'v1/entity/actions/commands/updateItem/types'
import type { ParserInput } from 'v1/schema/actions/tParse'

import type { Schema, SchemaAction } from '../../schema'
import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants/requiredOptions'
import type { $type, $enum, $transform } from '../constants/attributeOptions'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeState,
  Transformer
} from './types'
import type { FreezePrimitiveAttribute } from './freeze'

export interface $PrimitiveAttributeState<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> extends $SharedAttributeState<STATE> {
  [$type]: TYPE
  [$enum]: STATE['enum']
  [$transform]: STATE['transform']
}

export interface $PrimitiveAttributeNestedState<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> extends $PrimitiveAttributeState<TYPE, STATE> {
  freeze: (path?: string) => FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>
}

/**
 * Primitive attribute interface
 */
export interface $PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> extends $PrimitiveAttributeNestedState<TYPE, STATE> {
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
  ) => $PrimitiveAttribute<TYPE, O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $PrimitiveAttribute<TYPE, O.Overwrite<STATE, { required: Never }>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $PrimitiveAttribute<TYPE, O.Overwrite<STATE, { hidden: true }>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $PrimitiveAttribute<TYPE, O.Overwrite<STATE, { required: Always; key: true }>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $PrimitiveAttribute<TYPE, O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NEXT_ENUM extends ResolvePrimitiveAttributeType<TYPE>[]>(
    ...nextEnum: NEXT_ENUM
  ) => /**
   * @debt type "O.Overwrite widens NEXT_ENUM type to its type constraint for some reason"
   */
  $PrimitiveAttribute<TYPE, O.Update<STATE, 'enum', NEXT_ENUM>>
  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const: <CONSTANT extends ResolvePrimitiveAttributeType<TYPE>>(
    constant: CONSTANT
  ) => $PrimitiveAttribute<
    TYPE,
    O.Overwrite<
      STATE,
      {
        enum: [CONSTANT]
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
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault: (
    nextKeyDefault: ValueOrGetter<
      ParserInput<
        FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
        { operation: 'key'; fill: false }
      >
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
      ParserInput<FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>, { fill: false }>
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
        FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
        true
      >
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
          FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
          { operation: 'key'; fill: false }
        >,
        ParserInput<
          FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
          { fill: false }
        >
      >
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  transform: (
    transformer: Transformer<
      Extract<
        If<
          STATE['key'],
          ParserInput<
            FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
            { operation: 'key'; fill: false }
          >,
          ParserInput<
            FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
            { fill: false }
          >
        >,
        ResolvePrimitiveAttributeType<TYPE>
      >,
      ResolvePrimitiveAttributeType<TYPE>
    >
  ) => $PrimitiveAttribute<TYPE, O.Overwrite<STATE, { transform: unknown }>>
  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink: <SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: ParserInput<SCHEMA, { operation: 'key'; fill: false }>
    ) => ParserInput<
      FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
      { operation: 'key'; fill: false }
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
    ) => ParserInput<
      FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
      { fill: false }
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
      FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
      true
    >
  ) => $PrimitiveAttribute<
    TYPE,
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
        FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
        { operation: 'key'; fill: false }
      >,
      ParserInput<FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>, { fill: false }>
    >
  ) => $PrimitiveAttribute<
    TYPE,
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

export class PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> implements SharedAttributeState<STATE> {
  type: TYPE
  path?: string
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  defaults: STATE['defaults']
  links: STATE['links']
  enum: STATE['enum']
  transform: STATE['transform']

  constructor({
    type,
    path,
    ...state
  }: STATE & {
    path?: string
    type: TYPE
  }) {
    this.type = type
    this.path = path
    this.required = state.required
    this.hidden = state.hidden
    this.key = state.key
    this.savedAs = state.savedAs
    this.defaults = state.defaults
    this.links = state.links
    this.enum = state.enum
    this.transform = state.transform
  }

  // DO NOT DE-COMMENT right now as they trigger a ts(7056) error on even relatively small schemas
  // TODO: Find a way not to trigger this error
  // build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
  //   schemaAction: new (schema: this) => SCHEMA_ACTION
  // ): SCHEMA_ACTION {
  //   return new schemaAction(this)
  // }
}
