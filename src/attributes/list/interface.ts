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
import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import type { Attribute } from '../types/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeListAttribute } from './freeze.js'
import { freezeListAttribute } from './freeze.js'
import type { $ListAttributeElements } from './types.js'

export interface $ListAttributeState<
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint,
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements
> {
  [$type]: 'list'
  [$state]: STATE
  [$elements]: $ELEMENTS
}

export interface $ListAttributeNestedState<
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint,
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements
> extends $ListAttributeState<STATE, $ELEMENTS> {
  freeze: (path?: string) => FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>, true>
}

/**
 * List attribute interface
 */
export class $ListAttribute<
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint,
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
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required<NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): $ListAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $ELEMENTS> {
    return new $ListAttribute(overwrite(this[$state], { required: nextRequired }), this[$elements])
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $ListAttribute<Overwrite<STATE, { required: Never }>, $ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $ListAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, $ELEMENTS> {
    return new $ListAttribute(overwrite(this[$state], { hidden: nextHidden }), this[$elements])
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $ListAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $ELEMENTS> {
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
  ): $ListAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $ELEMENTS> {
    return new $ListAttribute(overwrite(this[$state], { savedAs: nextSavedAs }), this[$elements])
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>
    >
  ): $ListAttribute<Overwrite<STATE, { keyDefault: unknown }>, $ELEMENTS> {
    return new $ListAttribute(
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
      ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>>
    >
  ): $ListAttribute<Overwrite<STATE, { putDefault: unknown }>, $ELEMENTS> {
    return new $ListAttribute(
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
      AttributeUpdateItemInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, true>
    >
  ): $ListAttribute<Overwrite<STATE, { updateDefault: unknown }>, $ELEMENTS> {
    return new $ListAttribute(
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
        ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>,
        ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>>
      >
    >
  ): If<
    STATE['key'],
    $ListAttribute<Overwrite<STATE, { keyDefault: unknown }>, $ELEMENTS>,
    $ListAttribute<Overwrite<STATE, { putDefault: unknown }>, $ELEMENTS>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $ListAttribute(
        overwrite(this[$state], { keyDefault: nextDefault as unknown }),
        this[$elements]
      ),
      new $ListAttribute(
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
    ) => ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>
  ): $ListAttribute<Overwrite<STATE, { keyLink: unknown }>, $ELEMENTS> {
    return new $ListAttribute(
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
    ) => ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>>
  ): $ListAttribute<Overwrite<STATE, { putLink: unknown }>, $ELEMENTS> {
    return new $ListAttribute(
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
    ) => AttributeUpdateItemInput<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, true>
  ): $ListAttribute<Overwrite<STATE, { updateLink: unknown }>, $ELEMENTS> {
    return new $ListAttribute(
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
      ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>, { mode: 'key' }>,
      ValidValue<FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>>
    >
  ): If<
    STATE['key'],
    $ListAttribute<Overwrite<STATE, { keyLink: unknown }>, $ELEMENTS>,
    $ListAttribute<Overwrite<STATE, { putLink: unknown }>, $ELEMENTS>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $ListAttribute(
        overwrite(this[$state], { keyLink: nextLink as unknown }),
        this[$elements]
      ),
      new $ListAttribute(overwrite(this[$state], { putLink: nextLink as unknown }), this[$elements])
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
        FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>,
        { mode: 'key'; defined: true }
      >,
      FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>
    >
  ): $ListAttribute<Overwrite<STATE, { keyValidator: Validator }>, $ELEMENTS> {
    return new $ListAttribute(
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
      ValidValue<FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>, { defined: true }>,
      FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>
    >
  ): $ListAttribute<Overwrite<STATE, { putValidator: Validator }>, $ELEMENTS> {
    return new $ListAttribute(
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
      AttributeUpdateItemInput<FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>, true>,
      FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>
    >
  ): $ListAttribute<Overwrite<STATE, { updateValidator: Validator }>, $ELEMENTS> {
    return new $ListAttribute(
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
          FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>, { defined: true }>
      >,
      FreezeListAttribute<$ListAttribute<STATE, $ELEMENTS>>
    >
  ): If<
    STATE['key'],
    $ListAttribute<Overwrite<STATE, { keyValidator: Validator }>, $ELEMENTS>,
    $ListAttribute<Overwrite<STATE, { putValidator: Validator }>, $ELEMENTS>
  > {
    return ifThenElse(
      this[$state].key as STATE['key'],
      new $ListAttribute(
        overwrite(this[$state], { keyValidator: nextValidator as Validator }),
        this[$elements] as $ELEMENTS
      ),
      new $ListAttribute(
        overwrite(this[$state], { putValidator: nextValidator as Validator }),
        this[$elements] as $ELEMENTS
      )
    )
  }

  freeze(path?: string): FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>, true> {
    return freezeListAttribute(this[$state], this[$elements], path)
  }
}

export class ListAttribute<
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint,
  ELEMENTS extends Attribute = Attribute
> {
  type: 'list'
  path?: string
  elements: ELEMENTS
  state: STATE

  constructor({ path, elements, ...state }: STATE & { path?: string; elements: ELEMENTS }) {
    this.type = 'list'
    this.path = path
    this.elements = elements
    this.state = state as unknown as STATE
  }
}

export class ListAttribute_<
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint,
  ELEMENTS extends Attribute = Attribute
> extends ListAttribute<STATE, ELEMENTS> {
  clone<NEXT_STATE extends Partial<SharedAttributeStateConstraint> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): ListAttribute_<
    ConstrainedOverwrite<SharedAttributeStateConstraint, STATE, NEXT_STATE>,
    ELEMENTS
  > {
    return new ListAttribute_({
      ...({
        ...(this.path !== undefined ? { path: this.path } : {}),
        ...this.state,
        ...nextState
      } as ConstrainedOverwrite<SharedAttributeStateConstraint, STATE, NEXT_STATE>),
      elements: this.elements
    })
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
