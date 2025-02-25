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

import { $attributes } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Validator } from '../types/validator.js'
import type { FreezeMapAttribute } from './freeze.js'
import { freezeMapAttribute } from './freeze.js'
import type { $MapAttributeAttributeStates, MapAttributeAttributes } from './types.js'

export interface $MapAttributeState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates
> {
  type: 'map'
  state: STATE
  [$attributes]: $ATTRIBUTES
}

export interface $MapAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates
> extends $MapAttributeState<STATE, $ATTRIBUTES> {
  freeze: (path?: string) => FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>, true>
}

/**
 * MapAttribute attribute interface
 */
export class $MapAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates = $MapAttributeAttributeStates
> implements $MapAttributeNestedState<STATE, $ATTRIBUTES>
{
  type: 'map'
  state: STATE;
  [$attributes]: $ATTRIBUTES

  constructor(state: STATE, attributes: $ATTRIBUTES) {
    this.type = 'map'
    this.state = state
    this[$attributes] = attributes
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
  ): $MapAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, $ATTRIBUTES> {
    return new $MapAttribute(overwrite(this.state, { required: nextRequired }), this[$attributes])
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
    return new $MapAttribute(overwrite(this.state, { hidden: nextHidden }), this[$attributes])
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $MapAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { key: nextKey, required: 'always' }),
      this[$attributes]
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $MapAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, $ATTRIBUTES> {
    return new $MapAttribute(overwrite(this.state, { savedAs: nextSavedAs }), this[$attributes])
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { mode: 'key' }>
    >
  ): $MapAttribute<Overwrite<STATE, { keyDefault: unknown }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { keyDefault: nextKeyDefault as unknown }),
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
      ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>>
    >
  ): $MapAttribute<Overwrite<STATE, { putDefault: unknown }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { putDefault: nextPutDefault as unknown }),
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
  ): $MapAttribute<Overwrite<STATE, { updateDefault: unknown }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown }),
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
        ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { mode: 'key' }>,
        ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>>
      >
    >
  ): If<
    STATE['key'],
    $MapAttribute<Overwrite<STATE, { keyDefault: unknown }>, $ATTRIBUTES>,
    $MapAttribute<Overwrite<STATE, { putDefault: unknown }>, $ATTRIBUTES>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $MapAttribute(
        overwrite(this.state, { keyDefault: nextDefault as unknown }),
        this[$attributes]
      ),
      new $MapAttribute(
        overwrite(this.state, { putDefault: nextDefault as unknown }),
        this[$attributes]
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
    ) => ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { mode: 'key' }>
  ): $MapAttribute<Overwrite<STATE, { keyLink: unknown }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { keyLink: nextKeyLink as unknown }),
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
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>>
  ): $MapAttribute<Overwrite<STATE, { putLink: unknown }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { putLink: nextPutLink as unknown }),
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
  ): $MapAttribute<Overwrite<STATE, { updateLink: unknown }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { updateLink: nextUpdateLink as unknown }),
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
      keyOrPutItemInput: If<STATE['key'], ValidValue<SCHEMA, { mode: 'key' }>, ValidValue<SCHEMA>>
    ) => If<
      STATE['key'],
      ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>, { mode: 'key' }>,
      ValidValue<FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>>
    >
  ): If<
    STATE['key'],
    $MapAttribute<Overwrite<STATE, { keyLink: unknown }>, $ATTRIBUTES>,
    $MapAttribute<Overwrite<STATE, { putLink: unknown }>, $ATTRIBUTES>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $MapAttribute(overwrite(this.state, { keyLink: nextLink as unknown }), this[$attributes]),
      new $MapAttribute(overwrite(this.state, { putLink: nextLink as unknown }), this[$attributes])
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
        FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>,
        { mode: 'key'; defined: true }
      >,
      FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>
    >
  ): $MapAttribute<Overwrite<STATE, { keyValidator: Validator }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator }),
      this[$attributes]
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>, { defined: true }>,
      FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>
    >
  ): $MapAttribute<Overwrite<STATE, { putValidator: Validator }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { putValidator: nextPutValidator as Validator }),
      this[$attributes]
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>, true>,
      FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>
    >
  ): $MapAttribute<Overwrite<STATE, { updateValidator: Validator }>, $ATTRIBUTES> {
    return new $MapAttribute(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator }),
      this[$attributes]
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
          FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>, { defined: true }>
      >,
      FreezeMapAttribute<$MapAttribute<STATE, $ATTRIBUTES>>
    >
  ): If<
    STATE['key'],
    $MapAttribute<Overwrite<STATE, { keyValidator: Validator }>, $ATTRIBUTES>,
    $MapAttribute<Overwrite<STATE, { putValidator: Validator }>, $ATTRIBUTES>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $MapAttribute(
        overwrite(this.state, { keyValidator: nextValidator as Validator }),
        this[$attributes]
      ),
      new $MapAttribute(
        overwrite(this.state, { putValidator: nextValidator as Validator }),
        this[$attributes]
      )
    )
  }

  freeze(path?: string): FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>, true> {
    return freezeMapAttribute(this.state, this[$attributes], path)
  }
}

export class MapAttribute<
  STATE extends SharedAttributeState = SharedAttributeState,
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'map'
  path?: string
  attributes: ATTRIBUTES
  state: STATE

  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>

  constructor({ path, attributes, ...state }: STATE & { path?: string; attributes: ATTRIBUTES }) {
    this.type = 'map'
    this.path = path
    this.attributes = attributes
    this.state = state as unknown as STATE

    const keyAttributeNames = new Set<string>()
    const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    /**
     * @debt bug "TODO: Throw when duplicate attribute savedAs"
     */
    for (const [attributeName, attribute] of Object.entries(attributes)) {
      const { key = false, required = 'atLeastOnce' } = attribute.state
      if (key) {
        keyAttributeNames.add(attributeName)
      }

      requiredAttributeNames[required].add(attributeName)
    }

    this.keyAttributeNames = keyAttributeNames
    this.requiredAttributeNames = requiredAttributeNames
  }
}

export class MapAttribute_<
  STATE extends SharedAttributeState = SharedAttributeState,
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> extends MapAttribute<STATE, ATTRIBUTES> {
  clone<NEXT_STATE extends Partial<SharedAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): MapAttribute_<ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>, ATTRIBUTES> {
    return new MapAttribute_({
      ...({
        ...(this.path !== undefined ? { path: this.path } : {}),
        ...this.state,
        ...nextState
      } as ConstrainedOverwrite<SharedAttributeState, STATE, NEXT_STATE>),
      attributes: this.attributes
    })
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
