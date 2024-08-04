/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import type { If, ValueOrGetter } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'
import { overwrite } from '~/utils/overwrite.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { freezeAnyAttribute } from './freeze.js'
import type { FreezeAnyAttribute } from './freeze.js'
import type { AnyAttributeState } from './types.js'

export interface $AnyAttributeState<STATE extends AnyAttributeState = AnyAttributeState> {
  [$type]: 'any'
  [$state]: STATE
}

export interface $AnyAttributeNestedState<STATE extends AnyAttributeState = AnyAttributeState>
  extends $AnyAttributeState<STATE> {
  freeze: (path?: string) => FreezeAnyAttribute<$AnyAttributeState<STATE>>
}

/**
 * Any attribute (warm)
 */
export class $AnyAttribute<STATE extends AnyAttributeState = AnyAttributeState>
  implements $AnyAttributeNestedState<STATE>
{
  [$type]: 'any';
  [$state]: STATE

  constructor(state: STATE) {
    this[$type] = 'any'
    this[$state] = state
  }

  /**
   * Tag attribute as required. Possible values are:
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required<NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): $AnyAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $AnyAttribute(overwrite(this[$state], { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $AnyAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $AnyAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $AnyAttribute(overwrite(this[$state], { hidden: nextHidden }))
  }

  /**
   * Tag attribute as needed for Primary Key computing
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $AnyAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $AnyAttribute(overwrite(this[$state], { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $AnyAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $AnyAttribute(overwrite(this[$state], { savedAs: nextSavedAs }))
  }

  /**
   * Cast attribute TS type
   */
  castAs<NEXT_CAST_AS>(
    nextCastAs = undefined as unknown as NEXT_CAST_AS
  ): $AnyAttribute<Overwrite<STATE, { castAs: NEXT_CAST_AS }>> {
    return new $AnyAttribute(overwrite(this[$state], { castAs: nextCastAs }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>
    >
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault as unknown,
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
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
    >
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault as unknown,
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
      AttributeUpdateItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
    >
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault as unknown
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
        ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>,
        ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
      >
    >
  ): $AnyAttribute<
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
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink<SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: ParserInput<SCHEMA, { mode: 'key'; fill: false }>
    ) => ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        links: {
          key: nextKeyLink as unknown,
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
    ) => ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink as unknown,
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
    ) => AttributeUpdateItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink as unknown
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
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; fill: false }>,
      ParserInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { fill: false }>
    >
  ): $AnyAttribute<
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
    return new $AnyAttribute(
      overwrite(this[$state], {
        links: this[$state].key
          ? {
              key: nextLink as unknown,
              put: this[$state].links.put,
              update: this[$state].links.update
            }
          : {
              key: this[$state].links.key,
              put: nextLink as unknown,
              update: this[$state].links.update
            }
      })
    )
  }

  freeze(path?: string): FreezeAnyAttribute<$AnyAttributeState<STATE>> {
    return freezeAnyAttribute(this[$state], path)
  }
}

export class AnyAttribute<STATE extends AnyAttributeState = AnyAttributeState>
  implements SharedAttributeState<STATE>
{
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
