// TODO: Remove this import
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import type { If, ValueOrGetter } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'
import type { Update } from '~/types/update.js'
import { overwrite } from '~/utils/overwrite.js'
import { update } from '~/utils/update.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { freezePrimitiveAttribute } from './freeze.js'
import type { FreezePrimitiveAttribute } from './freeze.js'
import type {
  PrimitiveAttributeState,
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  Transformer
} from './types.js'

export interface $PrimitiveAttributeState<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> {
  [$type]: TYPE
  [$state]: STATE
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
export class $PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> implements $PrimitiveAttributeNestedState<TYPE, STATE>
{
  [$type]: TYPE;
  [$state]: STATE

  constructor(type: TYPE, state: STATE) {
    this[$type] = type
    this[$state] = state
  }

  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required<NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): $PrimitiveAttribute<TYPE, Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $PrimitiveAttribute(this[$type], overwrite(this[$state], { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $PrimitiveAttribute<TYPE, Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $PrimitiveAttribute<TYPE, Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $PrimitiveAttribute(this[$type], overwrite(this[$state], { hidden: nextHidden }))
  }

  /**
   * Tag attribute as needed for Primary Key computing
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $PrimitiveAttribute<TYPE, Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], { key: nextKey, required: 'always' })
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $PrimitiveAttribute<TYPE, Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $PrimitiveAttribute(this[$type], overwrite(this[$state], { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<NEXT_ENUM extends ResolvePrimitiveAttributeType<TYPE>[]>(
    ...nextEnum: NEXT_ENUM
  ): /**
   * @debt type "Overwrite widens NEXT_ENUM type to its type constraint for some reason"
   */ $PrimitiveAttribute<TYPE, Update<STATE, 'enum', NEXT_ENUM>> {
    return new $PrimitiveAttribute(this[$type], update(this[$state], 'enum', nextEnum))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<CONSTANT extends ResolvePrimitiveAttributeType<TYPE>>(
    constant: CONSTANT
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
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
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        enum: [constant],
        defaults: this[$state].key
          ? { key: constant, put: this[$state].defaults.put, update: this[$state].defaults.update }
          : { key: this[$state].defaults.key, put: constant, update: this[$state].defaults.update }
      })
    )
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ParserInput<
        FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
        { mode: 'key'; fill: false }
      >
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
      STATE,
      {
        defaults: {
          key: unknown
          put: STATE['defaults']['put']
          update: STATE['defaults']['update']
        }
      }
    >
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault,
          put: this[$state].defaults.put,
          update: this[$state].defaults.update
        }
      })
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<
      ParserInput<FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>, { fill: false }>
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: unknown
          update: STATE['defaults']['update']
        }
      }
    >
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault,
          update: this[$state].defaults.update
        }
      })
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<
        FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
        true
      >
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: STATE['defaults']['put']
          update: unknown
        }
      }
    >
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault
        }
      })
    )
  }

  /**
   * Provide a default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  default(
    nextDefault: ValueOrGetter<
      If<
        STATE['key'],
        ParserInput<
          FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
          { mode: 'key'; fill: false }
        >,
        ParserInput<
          FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
          { fill: false }
        >
      >
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
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
  > {
    return this[$state].key ? this.keyDefault(nextDefault) : this.putDefault(nextDefault)
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  transform(
    transformer: Transformer<
      Extract<
        If<
          STATE['key'],
          ParserInput<
            FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
            { mode: 'key'; fill: false }
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
  ): $PrimitiveAttribute<TYPE, Overwrite<STATE, { transform: unknown }>> {
    return new $PrimitiveAttribute(this[$type], overwrite(this[$state], { transform: transformer }))
  }

  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink<SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: ParserInput<SCHEMA, { mode: 'key'; fill: false }>
    ) => ParserInput<
      FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
      { mode: 'key'; fill: false }
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
      STATE,
      {
        links: {
          key: unknown
          put: STATE['links']['put']
          update: STATE['links']['update']
        }
      }
    >
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        links: {
          key: nextKeyLink,
          put: this[$state].links.put,
          update: this[$state].links.update
        }
      })
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ParserInput<SCHEMA, { fill: false }>
    ) => ParserInput<
      FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
      { fill: false }
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: unknown
          update: STATE['links']['update']
        }
      }
    >
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink,
          update: this[$state].links.update
        }
      })
    )
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<
      FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
      true
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: STATE['links']['put']
          update: unknown
        }
      }
    >
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink
        }
      })
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextLink `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link<SCHEMA extends Schema>(
    nextLink: (
      keyOrPutItemInput: If<
        STATE['key'],
        ParserInput<SCHEMA, { mode: 'key'; fill: false }>,
        ParserInput<SCHEMA, { fill: false }>
      >
    ) => If<
      STATE['key'],
      ParserInput<
        FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>,
        { mode: 'key'; fill: false }
      >,
      ParserInput<FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>, { fill: false }>
    >
  ): $PrimitiveAttribute<
    TYPE,
    Overwrite<
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
  > {
    return new $PrimitiveAttribute(
      this[$type],
      overwrite(this[$state], {
        links: this[$state].key
          ? { key: nextLink, put: this[$state].links.put, update: this[$state].links.update }
          : { key: this[$state].links.key, put: nextLink, update: this[$state].links.update }
      })
    )
  }

  freeze(path?: string): FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>> {
    return freezePrimitiveAttribute(this[$type], this[$state], path)
  }
}

export class PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE> = PrimitiveAttributeState<TYPE>
> implements SharedAttributeState<STATE>
{
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
