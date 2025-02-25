/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import type {
  ConstrainedOverwrite,
  If,
  NarrowObject,
  Overwrite,
  ValueOrGetter
} from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'
import type { FreezeAnyAttribute } from './freeze.js'
import { freezeAnyAttribute } from './freeze.js'
import type { ResolveAnyAttribute } from './resolve.js'
import type { AnyAttributeState } from './types.js'

export interface $AnyAttributeState<STATE extends AnyAttributeState = AnyAttributeState> {
  [$type]: 'any'
  [$state]: STATE
}

export interface $AnyAttributeNestedState<STATE extends AnyAttributeState = AnyAttributeState>
  extends $AnyAttributeState<STATE> {
  freeze: (path?: string) => FreezeAnyAttribute<$AnyAttributeState<STATE>, true>
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
   * Tag attribute as a primary key attribute or linked to a primary attribute
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
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<
    TRANSFORMER extends Transformer<
      unknown,
      ResolveAnyAttribute<FreezeAnyAttribute<$AnyAttributeState<STATE>>>
    >
  >(transform: TRANSFORMER): $AnyAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $AnyAttribute(overwrite(this[$state], { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $AnyAttribute<Overwrite<STATE, { keyDefault: unknown }>> {
    return new $AnyAttribute(overwrite(this[$state], { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>>>
  ): $AnyAttribute<Overwrite<STATE, { putDefault: unknown }>> {
    return new $AnyAttribute(overwrite(this[$state], { putDefault: nextPutDefault as unknown }))
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
  ): $AnyAttribute<Overwrite<STATE, { updateDefault: unknown }>> {
    return new $AnyAttribute(
      overwrite(this[$state], { updateDefault: nextUpdateDefault as unknown })
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
        ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>>
      >
    >
  ): If<
    STATE['key'],
    $AnyAttribute<Overwrite<STATE, { keyDefault: unknown }>>,
    $AnyAttribute<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      this.keyDefault(nextDefault),
      this.putDefault(nextDefault)
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
    ) => ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key' }>
  ): $AnyAttribute<Overwrite<STATE, { keyLink: unknown }>> {
    return new $AnyAttribute(overwrite(this[$state], { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>>
  ): $AnyAttribute<Overwrite<STATE, { putLink: unknown }>> {
    return new $AnyAttribute(overwrite(this[$state], { putLink: nextPutLink as unknown }))
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
  ): $AnyAttribute<Overwrite<STATE, { updateLink: unknown }>> {
    return new $AnyAttribute(overwrite(this[$state], { updateLink: nextUpdateLink as unknown }))
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
      ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>>
    >
  ): If<
    STATE['key'],
    $AnyAttribute<Overwrite<STATE, { keyLink: unknown }>>,
    $AnyAttribute<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $AnyAttribute(overwrite(this[$state], { keyLink: nextLink as unknown })),
      new $AnyAttribute(overwrite(this[$state], { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<
      ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; defined: true }>,
      FreezeAnyAttribute<$AnyAttributeState<STATE>>
    >
  ): $AnyAttribute<Overwrite<STATE, { keyValidator: Validator }>> {
    return new $AnyAttribute(
      overwrite(this[$state], { keyValidator: nextKeyValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { defined: true }>,
      FreezeAnyAttribute<$AnyAttributeState<STATE>>
    >
  ): $AnyAttribute<Overwrite<STATE, { putValidator: Validator }>> {
    return new $AnyAttribute(
      overwrite(this[$state], { putValidator: nextPutValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<FreezeAnyAttribute<$AnyAttributeState<STATE>>, true>,
      FreezeAnyAttribute<$AnyAttributeState<STATE>>
    >
  ): $AnyAttribute<Overwrite<STATE, { updateValidator: Validator }>> {
    return new $AnyAttribute(
      overwrite(this[$state], { updateValidator: nextUpdateValidator as Validator })
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
        ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { mode: 'key'; defined: true }>,
        ValidValue<FreezeAnyAttribute<$AnyAttributeState<STATE>>, { defined: true }>
      >,
      FreezeAnyAttribute<$AnyAttributeState<STATE>>
    >
  ): If<
    STATE['key'],
    $AnyAttribute<Overwrite<STATE, { keyValidator: Validator }>>,
    $AnyAttribute<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $AnyAttribute(overwrite(this[$state], { keyValidator: nextValidator as Validator })),
      new $AnyAttribute(overwrite(this[$state], { putValidator: nextValidator as Validator }))
    )
  }

  freeze(path?: string): FreezeAnyAttribute<$AnyAttributeState<STATE>, true> {
    return freezeAnyAttribute(this[$state], path)
  }
}

export class AnyAttribute<STATE extends AnyAttributeState = AnyAttributeState> {
  type: 'any'
  path?: string
  state: STATE

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'any'
    this.path = path
    this.state = state as STATE
  }
}

export class AnyAttribute_<
  STATE extends AnyAttributeState = AnyAttributeState
> extends AnyAttribute<STATE> {
  clone<NEXT_STATE extends Partial<AnyAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): AnyAttribute_<ConstrainedOverwrite<AnyAttributeState, STATE, NEXT_STATE>> {
    return new AnyAttribute_({
      ...(this.path !== undefined ? { path: this.path } : {}),
      ...this.state,
      ...nextState
    } as ConstrainedOverwrite<AnyAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
