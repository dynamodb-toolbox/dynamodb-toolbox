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
  ValueOrGetter,
  Writable
} from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'
import { writable } from '~/utils/writable.js'

import { $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'
import type { FreezeNumberAttribute } from './freeze.js'
import { freezeNumberAttribute } from './freeze.js'
import type { ResolveNumberAttribute, ResolvedNumberAttribute } from './resolve.js'
import type { NumberAttributeState } from './types.js'

export interface $NumberAttributeState<STATE extends NumberAttributeState = NumberAttributeState> {
  [$type]: 'number'
  state: STATE
}

export interface $NumberAttributeNestedState<
  STATE extends NumberAttributeState = NumberAttributeState
> extends $NumberAttributeState<STATE> {
  freeze: (path?: string) => FreezeNumberAttribute<$NumberAttributeState<STATE>, true>
}

/**
 * Number attribute (warm)
 */
export class $NumberAttribute<STATE extends NumberAttributeState = NumberAttributeState>
  implements $NumberAttributeNestedState<STATE>
{
  [$type]: 'number'
  state: STATE

  constructor(state: STATE) {
    this[$type] = 'number'
    this.state = state
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
  ): $NumberAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $NumberAttribute(overwrite(this.state, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $NumberAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $NumberAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $NumberAttribute(overwrite(this.state, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $NumberAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $NumberAttribute(overwrite(this.state, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $NumberAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $NumberAttribute(overwrite(this.state, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<
    const NEXT_ENUM extends readonly ResolveNumberAttribute<
      FreezeNumberAttribute<$NumberAttributeState<STATE>>
    >[]
  >(...nextEnum: NEXT_ENUM): $NumberAttribute<Overwrite<STATE, { enum: Writable<NEXT_ENUM> }>> {
    return new $NumberAttribute(overwrite(this.state, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<
    CONSTANT extends ResolveNumberAttribute<FreezeNumberAttribute<$NumberAttributeState<STATE>>>
  >(
    constant: CONSTANT
  ): If<
    STATE['key'],
    $NumberAttribute<Overwrite<STATE, { enum: [CONSTANT]; keyDefault: unknown }>>,
    $NumberAttribute<Overwrite<STATE, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NumberAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new $NumberAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<
    TRANSFORMER extends Transformer<
      ResolvedNumberAttribute,
      ResolveNumberAttribute<FreezeNumberAttribute<$NumberAttributeState<STATE>>>
    >
  >(transform: TRANSFORMER): $NumberAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $NumberAttribute(overwrite(this.state, { transform }))
  }

  /**
   * Allow BigInts
   */
  big<NEXT_BIG extends boolean = true>(
    nextBig: NEXT_BIG = true as NEXT_BIG
  ): $NumberAttribute<Overwrite<STATE, { big: NEXT_BIG }>> {
    return new $NumberAttribute(overwrite(this.state, { big: nextBig }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $NumberAttribute<Overwrite<STATE, { keyDefault: unknown }>> {
    return new $NumberAttribute(overwrite(this.state, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>>>
  ): $NumberAttribute<Overwrite<STATE, { putDefault: unknown }>> {
    return new $NumberAttribute(overwrite(this.state, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeNumberAttribute<$NumberAttributeState<STATE>>, true>
    >
  ): $NumberAttribute<Overwrite<STATE, { updateDefault: unknown }>> {
    return new $NumberAttribute(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown })
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
        ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>>
      >
    >
  ): If<
    STATE['key'],
    $NumberAttribute<Overwrite<STATE, { keyDefault: unknown }>>,
    $NumberAttribute<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NumberAttribute(overwrite(this.state, { keyDefault: nextDefault as unknown })),
      new $NumberAttribute(overwrite(this.state, { putDefault: nextDefault as unknown }))
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
    ) => ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>, { mode: 'key' }>
  ): $NumberAttribute<Overwrite<STATE, { keyLink: unknown }>> {
    return new $NumberAttribute(overwrite(this.state, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>>
  ): $NumberAttribute<Overwrite<STATE, { putLink: unknown }>> {
    return new $NumberAttribute(overwrite(this.state, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<FreezeNumberAttribute<$NumberAttributeState<STATE>>, true>
  ): $NumberAttribute<Overwrite<STATE, { updateLink: unknown }>> {
    return new $NumberAttribute(overwrite(this.state, { updateLink: nextUpdateLink as unknown }))
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
      ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>>
    >
  ): If<
    STATE['key'],
    $NumberAttribute<Overwrite<STATE, { keyLink: unknown }>>,
    $NumberAttribute<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NumberAttribute(overwrite(this.state, { keyLink: nextLink as unknown })),
      new $NumberAttribute(overwrite(this.state, { putLink: nextLink as unknown }))
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
        FreezeNumberAttribute<$NumberAttributeState<STATE>>,
        { mode: 'key'; defined: true }
      >,
      FreezeNumberAttribute<$NumberAttributeState<STATE>>
    >
  ): $NumberAttribute<Overwrite<STATE, { keyValidator: Validator }>> {
    return new $NumberAttribute(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>, { defined: true }>,
      FreezeNumberAttribute<$NumberAttributeState<STATE>>
    >
  ): $NumberAttribute<Overwrite<STATE, { putValidator: Validator }>> {
    return new $NumberAttribute(
      overwrite(this.state, { putValidator: nextPutValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<FreezeNumberAttribute<$NumberAttributeState<STATE>>, true>,
      FreezeNumberAttribute<$NumberAttributeState<STATE>>
    >
  ): $NumberAttribute<Overwrite<STATE, { updateValidator: Validator }>> {
    return new $NumberAttribute(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator })
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
          FreezeNumberAttribute<$NumberAttributeState<STATE>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeNumberAttribute<$NumberAttributeState<STATE>>, { defined: true }>
      >,
      FreezeNumberAttribute<$NumberAttributeState<STATE>>
    >
  ): If<
    STATE['key'],
    $NumberAttribute<Overwrite<STATE, { keyValidator: Validator }>>,
    $NumberAttribute<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NumberAttribute(overwrite(this.state, { keyValidator: nextValidator as Validator })),
      new $NumberAttribute(overwrite(this.state, { putValidator: nextValidator as Validator }))
    )
  }

  freeze(path?: string): FreezeNumberAttribute<$NumberAttributeState<STATE>, true> {
    return freezeNumberAttribute(this.state, path)
  }
}

export class NumberAttribute<STATE extends NumberAttributeState = NumberAttributeState> {
  type: 'number'
  path?: string
  state: STATE

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'number'
    this.path = path
    this.state = state as STATE
  }
}

export class NumberAttribute_<
  STATE extends NumberAttributeState = NumberAttributeState
> extends NumberAttribute<STATE> {
  clone<NEXT_STATE extends Partial<NumberAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): NumberAttribute_<ConstrainedOverwrite<NumberAttributeState, STATE, NEXT_STATE>> {
    return new NumberAttribute_({
      ...(this.path !== undefined ? { path: this.path } : {}),
      ...this.state,
      ...nextState
    } as ConstrainedOverwrite<NumberAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
