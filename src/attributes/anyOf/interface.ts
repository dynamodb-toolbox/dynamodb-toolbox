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

import { $elements, $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Attribute } from '../types/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeAnyOfAttribute } from './freeze.js'
import { freezeAnyOfAttribute } from './freeze.js'
import type { $AnyOfAttributeElements } from './types.js'

export interface $AnyOfAttributeState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ELEMENTS extends $AnyOfAttributeElements[] = $AnyOfAttributeElements[]
> {
  [$type]: 'anyOf'
  [$state]: STATE
  [$elements]: $ELEMENTS
}

export interface $AnyOfAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ELEMENTS extends $AnyOfAttributeElements[] = $AnyOfAttributeElements[]
> extends $AnyOfAttributeState<STATE, $ELEMENTS> {
  freeze: (path?: string) => FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>, true>
}

/**
 * AnyOf attribute interface
 */
export class $AnyOfAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ELEMENTS extends $AnyOfAttributeElements[] = $AnyOfAttributeElements[]
> implements $AnyOfAttributeNestedState<STATE, $ELEMENTS>
{
  [$type]: 'anyOf';
  [$state]: STATE;
  [$elements]: $ELEMENTS

  constructor(state: STATE, elements: $ELEMENTS) {
    this[$type] = 'anyOf'
    this[$state] = state
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
  ): $AnyOfAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $ELEMENTS> {
    return new $AnyOfAttribute(overwrite(this[$state], { required: nextRequired }), this[$elements])
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $AnyOfAttribute<Overwrite<STATE, { required: Never }>, $ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $AnyOfAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, $ELEMENTS> {
    return new $AnyOfAttribute(overwrite(this[$state], { hidden: nextHidden }), this[$elements])
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $AnyOfAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { key: nextKey, required: 'always' }),
      this[$elements]
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $AnyOfAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $ELEMENTS> {
    return new $AnyOfAttribute(overwrite(this[$state], { savedAs: nextSavedAs }), this[$elements])
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>
    >
  ): $AnyOfAttribute<Overwrite<STATE, { keyDefault: unknown }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { keyDefault: nextKeyDefault as unknown }),
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
      ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>>
    >
  ): $AnyOfAttribute<Overwrite<STATE, { putDefault: unknown }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { putDefault: nextPutDefault as unknown }),
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
      AttributeUpdateItemInput<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>, true>
    >
  ): $AnyOfAttribute<Overwrite<STATE, { updateDefault: unknown }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { updateDefault: nextUpdateDefault as unknown }),
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
        ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>,
        ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>>
      >
    >
  ): If<
    STATE['key'],
    $AnyOfAttribute<Overwrite<STATE, { keyDefault: unknown }>, $ELEMENTS>,
    $AnyOfAttribute<Overwrite<STATE, { putDefault: unknown }>, $ELEMENTS>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $AnyOfAttribute(
        overwrite(this[$state], { keyDefault: nextDefault as unknown }),
        this[$elements]
      ),
      new $AnyOfAttribute(
        overwrite(this[$state], { putDefault: nextDefault as unknown }),
        this[$elements]
      )
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
    ) => ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>
  ): $AnyOfAttribute<Overwrite<STATE, { keyLink: unknown }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { keyLink: nextKeyLink as unknown }),
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
    ) => ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>>
  ): $AnyOfAttribute<Overwrite<STATE, { putLink: unknown }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { putLink: nextPutLink as unknown }),
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
      FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>,
      true
    >
  ): $AnyOfAttribute<Overwrite<STATE, { updateLink: unknown }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { updateLink: nextUpdateLink as unknown }),
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
      ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>,
      ValidValue<FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>>>
    >
  ): If<
    STATE['key'],
    $AnyOfAttribute<Overwrite<STATE, { keyLink: unknown }>, $ELEMENTS>,
    $AnyOfAttribute<Overwrite<STATE, { putLink: unknown }>, $ELEMENTS>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $AnyOfAttribute(
        overwrite(this[$state], { keyLink: nextLink as unknown }),
        this[$elements]
      ),
      new $AnyOfAttribute(
        overwrite(this[$state], { putLink: nextLink as unknown }),
        this[$elements]
      )
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
        FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>,
        { mode: 'key'; defined: true }
      >,
      FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>
    >
  ): $AnyOfAttribute<Overwrite<STATE, { keyValidator: Validator }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { keyValidator: nextKeyValidator as Validator }),
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
      ValidValue<FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>, { defined: true }>,
      FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>
    >
  ): $AnyOfAttribute<Overwrite<STATE, { putValidator: Validator }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { putValidator: nextPutValidator as Validator }),
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
      AttributeUpdateItemInput<FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>, true>,
      FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>
    >
  ): $AnyOfAttribute<Overwrite<STATE, { updateValidator: Validator }>, $ELEMENTS> {
    return new $AnyOfAttribute(
      overwrite(this[$state], { updateValidator: nextUpdateValidator as Validator }),
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
          FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>, { defined: true }>
      >,
      FreezeAnyOfAttribute<$AnyOfAttribute<STATE, $ELEMENTS>>
    >
  ): If<
    STATE['key'],
    $AnyOfAttribute<Overwrite<STATE, { keyValidator: Validator }>, $ELEMENTS>,
    $AnyOfAttribute<Overwrite<STATE, { putValidator: Validator }>, $ELEMENTS>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $AnyOfAttribute(
        overwrite(this[$state], { keyValidator: nextValidator as Validator }),
        this[$elements]
      ),
      new $AnyOfAttribute(
        overwrite(this[$state], { putValidator: nextValidator as Validator }),
        this[$elements]
      )
    )
  }

  freeze(path?: string): FreezeAnyOfAttribute<$AnyOfAttributeState<STATE, $ELEMENTS>, true> {
    return freezeAnyOfAttribute(this[$state], this[$elements], path)
  }
}

export class AnyOfAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends Attribute[] = Attribute[]
> {
  type: 'anyOf'
  path?: string
  elements: ELEMENTS
  state: STATE

  constructor({ path, elements, ...state }: STATE & { path?: string; elements: ELEMENTS }) {
    this.type = 'anyOf'
    this.path = path
    this.elements = elements
    this.state = state as unknown as STATE
  }
}

export class AnyOfAttribute_<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends Attribute[] = Attribute[]
> extends AnyOfAttribute<STATE, ELEMENTS> {
  clone<NEXT_STATE extends SharedAttributeState = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): AnyOfAttribute_<ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>, ELEMENTS> {
    return new AnyOfAttribute_({
      ...({
        ...(this.path !== undefined ? { path: this.path } : {}),
        ...this.state,
        ...nextState
      } as ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>),
      elements: this.elements
    })
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
