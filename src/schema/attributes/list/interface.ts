import type { O } from 'ts-toolbelt'

// TODO: Remove this import
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { If, ValueOrGetter } from '~/types/index.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Schema } from '../../schema.js'
import { $elements, $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Attribute } from '../types/index.js'
import { freezeListAttribute } from './freeze.js'
import type { FreezeListAttribute } from './freeze.js'
import type { $ListAttributeElements } from './types.js'

export interface $ListAttributeState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements
> {
  [$type]: 'list'
  [$state]: STATE
  [$elements]: $ELEMENTS
}

export interface $ListAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements
> extends $ListAttributeState<STATE, $ELEMENTS> {
  freeze: (path?: string) => FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>
}

/**
 * List attribute interface
 */
export class $ListAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements
> implements $ListAttributeNestedState<STATE, $ELEMENTS>
{
  [$type]: 'list';
  [$state]: STATE;
  [$elements]: $ELEMENTS

  constructor(state: STATE, elements: $ELEMENTS) {
    this[$type] = 'list'
    this[$state] = state
    this[$elements] = elements
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
  ): $ListAttribute<O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $ELEMENTS> {
    return new $ListAttribute(overwrite(this[$state], { required: nextRequired }), this[$elements])
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $ListAttribute<O.Overwrite<STATE, { required: Never }>, $ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $ListAttribute<O.Overwrite<STATE, { hidden: NEXT_HIDDEN }>, $ELEMENTS> {
    return new $ListAttribute(overwrite(this[$state], { hidden: nextHidden }), this[$elements])
  }

  /**
   * Tag attribute as needed for Primary Key computing
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $ListAttribute<O.Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $ELEMENTS> {
    return new $ListAttribute(
      overwrite(this[$state], { key: nextKey, required: 'always' }),
      this[$elements]
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $ListAttribute<O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $ELEMENTS> {
    return new $ListAttribute(overwrite(this[$state], { savedAs: nextSavedAs }), this[$elements])
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ParserInput<
        FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>,
        { mode: 'key'; fill: false }
      >
    >
  ): $ListAttribute<
    O.Overwrite<
      STATE,
      {
        defaults: {
          key: unknown
          put: STATE['defaults']['put']
          update: STATE['defaults']['update']
        }
      }
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault as unknown,
          put: this[$state].defaults.put,
          update: this[$state].defaults.update
        }
      }),
      this[$elements]
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<
      ParserInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { fill: false }>
    >
  ): $ListAttribute<
    O.Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: unknown
          update: STATE['defaults']['update']
        }
      }
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault as unknown,
          update: this[$state].defaults.update
        }
      }),
      this[$elements]
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, true>
    >
  ): $ListAttribute<
    O.Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: STATE['defaults']['put']
          update: unknown
        }
      }
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault as unknown
        }
      }),
      this[$elements]
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
          FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>,
          { mode: 'key'; fill: false }
        >,
        ParserInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { fill: false }>
      >
    >
  ): $ListAttribute<
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
    >,
    $ELEMENTS
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
    ) => ParserInput<
      FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>,
      { mode: 'key'; fill: false }
    >
  ): $ListAttribute<
    O.Overwrite<
      STATE,
      {
        links: {
          key: unknown
          put: STATE['links']['put']
          update: STATE['links']['update']
        }
      }
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
      overwrite(this[$state], {
        links: {
          key: nextKeyLink as unknown,
          put: this[$state].links.put,
          update: this[$state].links.update
        }
      }),
      this[$elements]
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
    ) => ParserInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { fill: false }>
  ): $ListAttribute<
    O.Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: unknown
          update: STATE['links']['update']
        }
      }
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink as unknown,
          update: this[$state].links.update
        }
      }),
      this[$elements]
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
    ) => AttributeUpdateItemInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, true>
  ): $ListAttribute<
    O.Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: STATE['links']['put']
          update: unknown
        }
      }
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink as unknown
        }
      }),
      this[$elements]
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
        FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>,
        { mode: 'key'; fill: false }
      >,
      ParserInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { fill: false }>
    >
  ): $ListAttribute<
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
    >,
    $ELEMENTS
  > {
    return new $ListAttribute(
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
      }),
      this[$elements]
    )
  }

  freeze(path?: string): FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>> {
    return freezeListAttribute(this[$state], this[$elements], path)
  }
}

export class ListAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends Attribute = Attribute
> implements SharedAttributeState<STATE>
{
  type: 'list'
  path?: string
  elements: ELEMENTS
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  defaults: STATE['defaults']
  links: STATE['links']

  constructor({ path, elements, ...state }: STATE & { path?: string; elements: ELEMENTS }) {
    this.type = 'list'
    this.path = path
    this.elements = elements
    this.required = state.required
    this.hidden = state.hidden
    this.key = state.key
    this.savedAs = state.savedAs
    this.defaults = state.defaults
    this.links = state.links
  }

  // DO NOT DE-COMMENT right now as they trigger a ts(7056) error on even relatively small schemas
  // TODO: Find a way not to trigger this error
  // build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
  //   schemaAction: new (schema: this) => SCHEMA_ACTION
  // ): SCHEMA_ACTION {
  //   return new schemaAction(this)
  // }
}
