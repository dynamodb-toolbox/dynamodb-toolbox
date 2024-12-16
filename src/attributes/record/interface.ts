/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type {
  ConstrainedOverwrite,
  If,
  NarrowObject,
  Overwrite,
  ValueOrGetter
} from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import { $elements, $keys, $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Attribute } from '../types/index.js'
import type { Validator } from '../types/validator.js'
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
  freeze: (
    path?: string
  ) => FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>, true>
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
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required<NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): $RecordAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this[$state], { required: nextRequired }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $RecordAttribute<Overwrite<STATE, { required: Never }>, $KEYS, $ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $RecordAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this[$state], { hidden: nextHidden }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $RecordAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $KEYS, $ELEMENTS> {
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
  ): $RecordAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $KEYS, $ELEMENTS> {
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
      ValidValue<
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        { mode: 'key' }
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault as unknown,
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
      ValidValue<FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>>
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault as unknown,
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault as unknown
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
        ValidValue<
          FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
          { mode: 'key' }
        >,
        ValidValue<FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>>
      >
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        defaults: ifThenElse(
          this[$state].key,
          {
            key: nextDefault as unknown,
            put: this[$state].defaults.put,
            update: this[$state].defaults.update
          },
          {
            key: this[$state].defaults.key,
            put: nextDefault as unknown,
            update: this[$state].defaults.update
          }
        )
      }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink<SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: ValidValue<SCHEMA, { mode: 'key' }>
    ) => ValidValue<
      FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
      { mode: 'key' }
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: {
          key: nextKeyLink as unknown,
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
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>>
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink as unknown,
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink as unknown
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
      keyOrPutItemInput: If<STATE['key'], ValidValue<SCHEMA, { mode: 'key' }>, ValidValue<SCHEMA>>
    ) => If<
      STATE['key'],
      ValidValue<
        FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>,
        { mode: 'key' }
      >,
      ValidValue<FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>>>
    >
  ): $RecordAttribute<
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
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        links: ifThenElse(
          this[$state].key,
          {
            key: nextLink as unknown,
            put: this[$state].links.put,
            update: this[$state].links.update
          },
          {
            key: this[$state].links.key,
            put: nextLink as unknown,
            update: this[$state].links.update
          }
        )
      }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<
      ValidValue<
        FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>,
        { mode: 'key'; defined: true }
      >,
      FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>
    >
  ): $RecordAttribute<
    Overwrite<
      STATE,
      {
        validators: {
          key: Validator
          put: STATE['validators']['put']
          update: STATE['validators']['update']
        }
      }
    >,
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        validators: {
          key: nextKeyValidator as Validator,
          put: this[$state].validators.put,
          update: this[$state].validators.update
        }
      }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<
        FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>,
        { defined: true }
      >,
      FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>
    >
  ): $RecordAttribute<
    Overwrite<
      STATE,
      {
        validators: {
          key: STATE['validators']['key']
          put: Validator
          update: STATE['validators']['update']
        }
      }
    >,
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        validators: {
          key: this[$state].validators.key,
          put: nextPutValidator as Validator,
          update: this[$state].validators.update
        }
      }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<
        FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>,
        true
      >,
      FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>
    >
  ): $RecordAttribute<
    Overwrite<
      STATE,
      {
        validators: {
          key: STATE['validators']['key']
          put: STATE['validators']['put']
          update: Validator
        }
      }
    >,
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        validators: {
          key: this[$state].validators.key,
          put: this[$state].validators.put,
          update: nextUpdateValidator as Validator
        }
      }),
      this[$keys],
      this[$elements]
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextValidator `(key/putAttributeInput) => boolean | string`
   */
  validate(
    nextValidator: Validator<
      If<
        STATE['key'],
        ValidValue<
          FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<
          FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>,
          { defined: true }
        >
      >,
      FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>
    >
  ): $RecordAttribute<
    Overwrite<
      STATE,
      {
        validators: If<
          STATE['key'],
          {
            key: Validator
            put: STATE['validators']['put']
            update: STATE['validators']['update']
          },
          {
            key: STATE['validators']['key']
            put: Validator
            update: STATE['validators']['update']
          }
        >
      }
    >,
    $KEYS,
    $ELEMENTS
  > {
    return new $RecordAttribute(
      overwrite(this[$state], {
        validators: ifThenElse(
          /**
           * @debt type "remove this cast"
           */
          this[$state].key as STATE['key'],
          {
            key: nextValidator as Validator,
            put: this[$state].validators.put,
            update: this[$state].validators.update
          },
          {
            key: this[$state].validators.key,
            put: nextValidator as Validator,
            update: this[$state].validators.update
          }
        )
      }),
      this[$keys],
      this[$elements]
    )
  }

  freeze(
    path?: string
  ): FreezeRecordAttribute<$RecordAttributeState<STATE, $KEYS, $ELEMENTS>, true> {
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
  validators: STATE['validators']

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
    this.validators = state.validators
  }
}

export class RecordAttribute_<
  STATE extends SharedAttributeState = SharedAttributeState,
  KEYS extends RecordAttributeKeys = RecordAttributeKeys,
  ELEMENTS extends Attribute = Attribute
> extends RecordAttribute<STATE, KEYS, ELEMENTS> {
  clone<NEXT_STATE extends Partial<SharedAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): RecordAttribute_<
    ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>,
    KEYS,
    ELEMENTS
  > {
    return new RecordAttribute_({
      ...({
        ...this,
        defaults: { ...this.defaults },
        links: { ...this.links },
        validators: { ...this.validators },
        ...nextState
      } as ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>),
      keys: this.keys,
      elements: this.elements
    })
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
