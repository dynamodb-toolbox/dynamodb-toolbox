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

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { StringSchema } from '../string/index.js'
import type { AttrSchema } from '../types/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeRecordAttribute } from './freeze.js'
import { freezeRecordAttribute } from './freeze.js'

export interface RecordSchema<
  STATE extends SharedAttributeState = SharedAttributeState,
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends AttrSchema = AttrSchema
> {
  type: 'record'
  path?: string
  state: STATE
  keys: KEYS
  elements: ELEMENTS
}

export interface $RecordAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $KEYS extends StringSchema = StringSchema,
  $ELEMENTS extends AttrSchema = AttrSchema
> extends RecordSchema<STATE, $KEYS, $ELEMENTS> {
  check: (path?: string) => void
  freeze: (path?: string) => FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>, true>
}

/**
 * Record attribute interface
 */
export class $RecordAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  $KEYS extends StringSchema = StringSchema,
  $ELEMENTS extends AttrSchema = AttrSchema
> implements $RecordAttributeNestedState<STATE, $KEYS, $ELEMENTS>
{
  type: 'record'
  path?: string
  state: STATE
  keys: $KEYS
  elements: $ELEMENTS

  constructor(state: STATE, keys: $KEYS, elements: $ELEMENTS) {
    this.type = 'record'
    this.state = state
    this.keys = keys
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
  ): $RecordAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { required: nextRequired }),
      this.keys,
      this.elements
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
      overwrite(this.state, { hidden: nextHidden }),
      this.keys,
      this.elements
    )
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $RecordAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { key: nextKey, required: 'always' }),
      this.keys,
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $RecordAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { savedAs: nextSavedAs }),
      this.keys,
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>, { mode: 'key' }>
    >
  ): $RecordAttribute<Overwrite<STATE, { keyDefault: unknown }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { keyDefault: nextKeyDefault as unknown }),
      this.keys,
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<
      ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>>
    >
  ): $RecordAttribute<Overwrite<STATE, { putDefault: unknown }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { putDefault: nextPutDefault as unknown }),
      this.keys,
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>, true>
    >
  ): $RecordAttribute<Overwrite<STATE, { updateDefault: unknown }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown }),
      this.keys,
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
      If<
        STATE['key'],
        ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>, { mode: 'key' }>,
        ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>>
      >
    >
  ): If<
    STATE['key'],
    $RecordAttribute<Overwrite<STATE, { keyDefault: unknown }>, $KEYS, $ELEMENTS>,
    $RecordAttribute<Overwrite<STATE, { putDefault: unknown }>, $KEYS, $ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $RecordAttribute(
        overwrite(this.state, { keyDefault: nextDefault as unknown }),
        this.keys,
        this.elements
      ),
      new $RecordAttribute(
        overwrite(this.state, { putDefault: nextDefault as unknown }),
        this.keys,
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
    ) => ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>, { mode: 'key' }>
  ): $RecordAttribute<Overwrite<STATE, { keyLink: unknown }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { keyLink: nextKeyLink as unknown }),
      this.keys,
      this.elements
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
    ) => ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>>
  ): $RecordAttribute<Overwrite<STATE, { putLink: unknown }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { putLink: nextPutLink as unknown }),
      this.keys,
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
    ) => AttributeUpdateItemInput<
      FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>,
      true
    >
  ): $RecordAttribute<Overwrite<STATE, { updateLink: unknown }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { updateLink: nextUpdateLink as unknown }),
      this.keys,
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
    ) => If<
      STATE['key'],
      ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>, { mode: 'key' }>,
      ValidValue<FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>>>
    >
  ): If<
    STATE['key'],
    $RecordAttribute<Overwrite<STATE, { keyLink: unknown }>, $KEYS, $ELEMENTS>,
    $RecordAttribute<Overwrite<STATE, { putLink: unknown }>, $KEYS, $ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $RecordAttribute(
        overwrite(this.state, { keyLink: nextLink as unknown }),
        this.keys,
        this.elements
      ),
      new $RecordAttribute(
        overwrite(this.state, { putLink: nextLink as unknown }),
        this.keys,
        this.elements
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
        FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>,
        { mode: 'key'; defined: true }
      >,
      FreezeRecordAttribute<$RecordAttribute<STATE, $KEYS, $ELEMENTS>>
    >
  ): $RecordAttribute<Overwrite<STATE, { keyValidator: Validator }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator }),
      this.keys,
      this.elements
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
  ): $RecordAttribute<Overwrite<STATE, { putValidator: Validator }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { putValidator: nextPutValidator as Validator }),
      this.keys,
      this.elements
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
  ): $RecordAttribute<Overwrite<STATE, { updateValidator: Validator }>, $KEYS, $ELEMENTS> {
    return new $RecordAttribute(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator }),
      this.keys,
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
  ): If<
    STATE['key'],
    $RecordAttribute<Overwrite<STATE, { keyValidator: Validator }>, $KEYS, $ELEMENTS>,
    $RecordAttribute<Overwrite<STATE, { putValidator: Validator }>, $KEYS, $ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $RecordAttribute(
        overwrite(this.state, { keyValidator: nextValidator as Validator }),
        this.keys,
        this.elements
      ),
      new $RecordAttribute(
        overwrite(this.state, { putValidator: nextValidator as Validator }),
        this.keys,
        this.elements
      )
    )
  }

  freeze(path?: string): FreezeRecordAttribute<RecordSchema<STATE, $KEYS, $ELEMENTS>, true> {
    return freezeRecordAttribute(this.state, this.keys, this.elements, path)
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    validateAttributeProperties(this.state, path)

    if (this.keys.type !== 'string') {
      throw new DynamoDBToolboxError('schema.recordAttribute.invalidKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys must be a string.`,
        path
      })
    }

    const {
      required: keysRequired,
      hidden: keysHidden,
      key: keysKey,
      savedAs: keysSavedAs
    } = this.keys.state

    // Checking $key before $required as $key implies attribute is always $required
    if (keysKey !== undefined && keysKey !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.keyKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be part of primary key.`,
        path
      })
    }

    if (keysRequired !== undefined && keysRequired !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.recordAttribute.optionalKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys must be required.`,
        path
      })
    }

    if (keysHidden !== undefined && keysHidden !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.hiddenKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be hidden.`,
        path
      })
    }

    if (keysSavedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.recordAttribute.savedAsKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.keys)) {
      throw new DynamoDBToolboxError('schema.recordAttribute.defaultedKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot have default or linked values.`,
        path
      })
    }

    const {
      key: elementsKey,
      required: elementsRequired,
      hidden: elementsHidden,
      savedAs: elementsSavedAs
    } = this.elements.state

    // Checking $key before $required as $key implies attribute is always $required
    if (elementsKey !== undefined && elementsKey !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.keyElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be part of primary key.`,
        path
      })
    }

    if (elementsRequired !== undefined && elementsRequired !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.recordAttribute.optionalElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements must be required.`,
        path
      })
    }

    if (elementsHidden !== undefined && elementsHidden !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.hiddenElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be hidden.`,
        path
      })
    }

    if (elementsSavedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.recordAttribute.savedAsElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.recordAttribute.defaultedElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Records elements cannot have default or linked values.`,
        path
      })
    }

    // @ts-ignore TOFIX
    this.keys.check(path && `${path} (KEY)`)
    // @ts-ignore TOFIX
    this.elements.check(`${path ?? ''}[string]`)

    Object.freeze(this.state)
    Object.freeze(this.keys)
    Object.freeze(this.elements)
    if (path !== undefined) {
      this.path = path
    }
  }
}

export class RecordAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends AttrSchema = AttrSchema
> {
  type: 'record'
  path?: string
  keys: KEYS
  elements: ELEMENTS
  state: STATE

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
    this.state = state as unknown as STATE
  }
}

export class RecordAttribute_<
  STATE extends SharedAttributeState = SharedAttributeState,
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends AttrSchema = AttrSchema
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
        ...(this.path !== undefined ? { path: this.path } : {}),
        ...this.state,
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
