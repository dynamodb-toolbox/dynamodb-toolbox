import type { O } from 'ts-toolbelt'

// TODO: Remove this import
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import type { If, ValueOrGetter } from '~/types/index.js'
import { overwrite } from '~/utils/overwrite.js'

import { $elements, $keys, $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Attribute } from '../types/index.js'
import { freezeRecordAttribute } from './freeze.js'
import type { FreezeRecordAttribute } from './freeze.js'
import type {
  $RecordAttributeElements,
  $RecordAttributeKeys,
  RecordAttributeKeys
} from './types.js'

export interface $RecordAttributeState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements
> {
  [$type]: 'record'
  [$state]: STATE
  [$keys]: $KEYS
  [$elements]: $ELEMENTS
}

export interface $RecordAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements
> extends $RecordAttributeState<STATE, $KEYS, $ELEMENTS> {
  freeze: (path?: string) => FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>
}

/**
 * Record attribute interface
 */
export class $RecordAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements
> implements $RecordAttributeNestedState<STATE, $KEYS, $ELEMENTS>
{
  [$type]: 'record';
  [$state]: STATE;
  [$keys]: $KEYS;
  [$elements]: $ELEMENTS

  constructor(state: STATE, keys: $KEYS, elements: $ELEMENTS) {
    this[$type] = 'record'
    this[$state] = state
    this[$keys] = keys
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
  ): $RecordAttribute<O.Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this[$state], { required: nextRequired }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $RecordAttribute<O.Overwrite<STATE, { required: Never }>, $KEYS, $ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $RecordAttribute<O.Overwrite<STATE, { hidden: NEXT_HIDDEN }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this[$state], { hidden: nextHidden }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Tag attribute as needed for Primary Key computing
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $RecordAttribute<O.Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this[$state], { key: nextKey, required: 'always' }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $RecordAttribute<O.Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this[$state], { savedAs: nextSavedAs }),
      this[$keys],
      this[$elements]
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
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        { mode: 'key'; fill: false }
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault,
          put: this[$state].defaults.put,
          update: this[$state].defaults.update
        }
      }),
      this[$keys],
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
      ParserInput<
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        { fill: false }
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault,
          update: this[$state].defaults.update
        }
      }),
      this[$keys],
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
      AttributeUpdateItemInput<
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        true
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault
        }
      }),
      this[$keys],
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
          FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
          { mode: 'key'; fill: false }
        >,
        ParserInput<
          FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
          { fill: false }
        >
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
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
      FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
      { mode: 'key'; fill: false }
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: {
          key: nextKeyLink,
          put: this[$state].links.put,
          update: this[$state].links.update
        }
      }),
      this[$keys],
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
    ) => ParserInput<
      FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
      { fill: false }
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink,
          update: this[$state].links.update
        }
      }),
      this[$keys],
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
    ) => AttributeUpdateItemInput<
      FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
      true
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink
        }
      }),
      this[$keys],
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
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        { mode: 'key'; fill: false }
      >,
      ParserInput<
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        { fill: false }
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: this[$state].key
          ? { key: nextLink, put: this[$state].links.put, update: this[$state].links.update }
          : { key: this[$state].links.key, put: nextLink, update: this[$state].links.update }
      }),
      this[$keys],
      this[$elements]
    )
  }

  freeze(path?: string): FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>> {
    return freezeRecordAttribute(this[$state], this[$keys], this[$elements], path)
  }
}

export class RecordAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  KEYS extends RecordAttributeKeys = RecordAttributeKeys,
  ELEMENTS extends Attribute = Attribute
> implements SharedAttributeState<STATE>
{
  type: 'record'
  path?: string
  keys: KEYS
  elements: ELEMENTS
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  defaults: STATE['defaults']
  links: STATE['links']

  constructor({
    path,
    keys,
    elements,
    ...state
  }: STATE & { path?: string; keys: KEYS; elements: ELEMENTS }) {
    this.type = 'record'
    this.path = path
    this.keys = keys
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
