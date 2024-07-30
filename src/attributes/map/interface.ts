/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import type { If, ValueOrGetter } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'
import { overwrite } from '~/utils/overwrite.js'

import { $attributes, $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { freezeMapAttribute } from './freeze.js'
import type { FreezeMapAttribute } from './freeze.js'
import type { $MapAttributeAttributeStates, MapAttributeAttributes } from './types.js'

export interface $MapAttributeState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates
> {
  [$type]: 'map'
  [$state]: STATE
  [$attributes]: $ATTRIBUTES
}

export interface $MapAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates
> extends $MapAttributeState<STATE, $ATTRIBUTES> {
  freeze: (path?: string) => FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>
}

/**
 * MapAttribute attribute interface
 */
export class $MapAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates
> implements $MapAttributeNestedState<STATE, $ATTRIBUTES>
{
  [$type]: 'map';
  [$state]: STATE;
  [$attributes]: $ATTRIBUTES

  constructor(state: STATE, attributes: $ATTRIBUTES) {
    this[$type] = 'map'
    this[$state] = state
    this[$attributes] = attributes
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
  ): $MapAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $ATTRIBUTES> {
    return new $MapAttribute(overwrite(this[$state], { required: nextRequired }), this[$attributes])
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $MapAttribute<Overwrite<STATE, { required: Never }>, $ATTRIBUTES> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $MapAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, $ATTRIBUTES> {
    return new $MapAttribute(overwrite(this[$state], { hidden: nextHidden }), this[$attributes])
  }

  /**
   * Tag attribute as needed for Primary Key computing
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $MapAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this[$state], { key: nextKey, required: 'always' }),
      this[$attributes]
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $MapAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $ATTRIBUTES> {
    return new $MapAttribute(overwrite(this[$state], { savedAs: nextSavedAs }), this[$attributes])
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ParserInput<
        FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>,
        { mode: 'key'; fill: false }
      >
    >
  ): $MapAttribute<
    Overwrite<
      STATE,
      {
        defaults: {
          key: unknown
          put: STATE['defaults']['put']
          update: STATE['defaults']['update']
        }
      }
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault,
          put: this[$state].defaults.put,
          update: this[$state].defaults.update
        }
      }),
      this[$attributes]
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<
      ParserInput<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { fill: false }>
    >
  ): $MapAttribute<
    Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: unknown
          update: STATE['defaults']['update']
        }
      }
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault,
          update: this[$state].defaults.update
        }
      }),
      this[$attributes]
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, true>
    >
  ): $MapAttribute<
    Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: STATE['defaults']['put']
          update: unknown
        }
      }
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault
        }
      }),
      this[$attributes]
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
          FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>,
          { mode: 'key'; fill: false }
        >,
        ParserInput<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { fill: false }>
      >
    >
  ): $MapAttribute<
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
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        defaults: this[$state].key
          ? {
              key: nextDefault,
              put: this[$state].defaults.put,
              update: this[$state].defaults.update
            }
          : {
              key: this[$state].defaults.key,
              put: nextDefault,
              update: this[$state].defaults.update
            }
      }),
      this[$attributes]
    )
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
      FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>,
      { mode: 'key'; fill: false }
    >
  ): $MapAttribute<
    Overwrite<
      STATE,
      {
        links: {
          key: unknown
          put: STATE['links']['put']
          update: STATE['links']['update']
        }
      }
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        links: {
          key: nextKeyLink,
          put: this[$state].links.put,
          update: this[$state].links.update
        }
      }),
      this[$attributes]
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
    ) => ParserInput<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { fill: false }>
  ): $MapAttribute<
    Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: unknown
          update: STATE['links']['update']
        }
      }
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink,
          update: this[$state].links.update
        }
      }),
      this[$attributes]
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
    ) => AttributeUpdateItemInput<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, true>
  ): $MapAttribute<
    Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: STATE['links']['put']
          update: unknown
        }
      }
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink
        }
      }),
      this[$attributes]
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
        FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>,
        { mode: 'key'; fill: false }
      >,
      ParserInput<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { fill: false }>
    >
  ): $MapAttribute<
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
    >,
    $ATTRIBUTES
  > {
    return new $MapAttribute(
      overwrite(this[$state], {
        links: this[$state].key
          ? {
              key: nextLink,
              put: this[$state].links.put,
              update: this[$state].links.update
            }
          : {
              key: this[$state].links.key,
              put: nextLink,
              update: this[$state].links.update
            }
      }),
      this[$attributes]
    )
  }

  freeze(path?: string): FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>> {
    return freezeMapAttribute(this[$state], this[$attributes], path)
  }
}

export class MapAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> implements SharedAttributeState<STATE>
{
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

  // DO NOT DE-COMMENT right now as they trigger a ts(7056) error on even relatively small schemas
  // TODO: Find a way not to trigger this error
  // build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
  //   schemaAction: new (schema: this) => SCHEMA_ACTION
  // ): SCHEMA_ACTION {
  //   return new schemaAction(this)
  // }
}
