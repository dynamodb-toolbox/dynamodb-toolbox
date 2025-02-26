/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
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

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import { checkAttributeProperties } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Validator } from '../types/validator.js'
import type { SetElementSchema } from './types.js'

export interface SetSchema<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> {
  type: 'set'
  path?: string
  state: STATE
  elements: ELEMENTS
}

export interface $SetAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> extends SetSchema<STATE, ELEMENTS> {
  check: (path?: string) => void
}

/**
 * Set attribute interface
 */
export class $SetAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> implements $SetAttributeNestedState<STATE, ELEMENTS>
{
  type: 'set'
  path?: string
  state: STATE
  elements: ELEMENTS

  constructor(state: STATE, elements: ELEMENTS) {
    this.type = 'set'
    this.state = state
    this.elements = elements
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
  ): $SetAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, ELEMENTS> {
    return new $SetAttribute(overwrite(this.state, { required: nextRequired }), this.elements)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $SetAttribute<Overwrite<STATE, { required: Never }>, ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $SetAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, ELEMENTS> {
    return new $SetAttribute(overwrite(this.state, { hidden: nextHidden }), this.elements)
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $SetAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { key: nextKey, required: 'always' }),
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $SetAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, ELEMENTS> {
    return new $SetAttribute(overwrite(this.state, { savedAs: nextSavedAs }), this.elements)
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): $SetAttribute<Overwrite<STATE, { keyDefault: unknown }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { keyDefault: nextKeyDefault as unknown }),
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): $SetAttribute<Overwrite<STATE, { putDefault: unknown }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { putDefault: nextPutDefault as unknown }),
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<AttributeUpdateItemInput<this, true>>
  ): $SetAttribute<Overwrite<STATE, { updateDefault: unknown }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown }),
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  default(
    nextDefault: ValueOrGetter<
      If<STATE['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
    >
  ): If<
    STATE['key'],
    $SetAttribute<Overwrite<STATE, { keyDefault: unknown }>, ELEMENTS>,
    $SetAttribute<Overwrite<STATE, { putDefault: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $SetAttribute(
        overwrite(this.state, { keyDefault: nextDefault as unknown }),
        this.elements
      ),
      new $SetAttribute(
        overwrite(this.state, { putDefault: nextDefault as unknown }),
        this.elements
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
    ) => ValidValue<this, { mode: 'key' }>
  ): $SetAttribute<Overwrite<STATE, { keyLink: unknown }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { keyLink: nextKeyLink as unknown }),
      this.elements
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA>) => ValidValue<this>
  ): $SetAttribute<Overwrite<STATE, { putLink: unknown }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { putLink: nextPutLink as unknown }),
      this.elements
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
    ) => AttributeUpdateItemInput<this, true>
  ): $SetAttribute<Overwrite<STATE, { updateLink: unknown }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { updateLink: nextUpdateLink as unknown }),
      this.elements
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
    ) => If<STATE['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
  ): If<
    STATE['key'],
    $SetAttribute<Overwrite<STATE, { keyLink: unknown }>, ELEMENTS>,
    $SetAttribute<Overwrite<STATE, { putLink: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $SetAttribute(overwrite(this.state, { keyLink: nextLink as unknown }), this.elements),
      new $SetAttribute(overwrite(this.state, { putLink: nextLink as unknown }), this.elements)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): $SetAttribute<Overwrite<STATE, { keyValidator: Validator }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator }),
      this.elements
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): $SetAttribute<Overwrite<STATE, { putValidator: Validator }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { putValidator: nextPutValidator as Validator }),
      this.elements
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<AttributeUpdateItemInput<this, true>, this>
  ): $SetAttribute<Overwrite<STATE, { updateValidator: Validator }>, ELEMENTS> {
    return new $SetAttribute(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator }),
      this.elements
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
        ValidValue<this, { mode: 'key'; defined: true }>,
        ValidValue<this, { defined: true }>
      >,
      this
    >
  ): If<
    STATE['key'],
    $SetAttribute<Overwrite<STATE, { keyValidator: Validator }>, ELEMENTS>,
    $SetAttribute<Overwrite<STATE, { putValidator: Validator }>, ELEMENTS>
  > {
    return ifThenElse(
      /**
       * @debt type "remove this cast"
       */
      this.state.key as STATE['key'],
      new $SetAttribute(
        overwrite(this.state, { keyValidator: nextValidator as Validator }),
        this.elements
      ),
      new $SetAttribute(
        overwrite(this.state, { putValidator: nextValidator as Validator }),
        this.elements
      )
    )
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkAttributeProperties(this.state, path)

    const { required, hidden, savedAs } = this.elements.state

    if (required !== undefined && required !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.setAttribute.optionalElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements must be required.`,
        path
      })
    }

    if (hidden !== undefined && hidden !== false) {
      throw new DynamoDBToolboxError('schema.setAttribute.hiddenElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot be hidden.`,
        path
      })
    }

    if (savedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.setAttribute.savedAsElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.setAttribute.defaultedElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot have default or linked values.`,
        path
      })
    }

    // @ts-ignore TOFIX
    this.elements.check(`${path ?? ''}[x]`)

    Object.freeze(this.state)
    Object.freeze(this.elements)
    if (path !== undefined) {
      this.path = path
    }
  }
}

export class SetAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> {
  type: 'set'
  path?: string
  elements: ELEMENTS
  state: STATE

  constructor({ path, elements, ...state }: STATE & { path?: string; elements: ELEMENTS }) {
    this.type = 'set'
    this.path = path
    this.elements = elements
    this.state = state as unknown as STATE
  }
}

export class SetAttribute_<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> extends SetAttribute<STATE, ELEMENTS> {
  clone<NEXT_STATE extends Partial<SharedAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): SetAttribute_<ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>, ELEMENTS> {
    return new SetAttribute_({
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
