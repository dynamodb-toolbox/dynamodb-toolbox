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
import type { Update } from '~/types/update.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'
import { update } from '~/utils/update.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Validator } from '../types/validator.js'
import { freezeStringAttribute } from './freeze.js'
import type { FreezeStringAttribute } from './freeze.js'
import type { ResolveStringAttribute, ResolvedStringAttribute } from './resolve.js'
import type { StringAttributeState } from './types.js'

export interface $StringAttributeState<STATE extends StringAttributeState = StringAttributeState> {
  [$type]: 'string'
  [$state]: STATE
}

export interface $StringAttributeNestedState<
  STATE extends StringAttributeState = StringAttributeState
> extends $StringAttributeState<STATE> {
  freeze: (path?: string) => FreezeStringAttribute<$StringAttributeState<STATE>>
}

/**
 * String attribute (warm)
 */
export class $StringAttribute<STATE extends StringAttributeState = StringAttributeState>
  implements $StringAttributeNestedState<STATE>
{
  [$type]: 'string';
  [$state]: STATE

  constructor(state: STATE) {
    this[$type] = 'string'
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
  ): $StringAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $StringAttribute(overwrite(this[$state], { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $StringAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $StringAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $StringAttribute(overwrite(this[$state], { hidden: nextHidden }))
  }

  /**
   * Tag attribute as needed for Primary Key computing
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $StringAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $StringAttribute(overwrite(this[$state], { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $StringAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $StringAttribute(overwrite(this[$state], { savedAs: nextSavedAs }))
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
    NEXT_ENUM extends ResolveStringAttribute<FreezeStringAttribute<$StringAttributeState<STATE>>>[]
  >(
    ...nextEnum: NEXT_ENUM
  ): /**
   * @debt type "Overwrite widens NEXT_ENUM type to its type constraint for some reason"
   */ $StringAttribute<Update<STATE, 'enum', NEXT_ENUM>> {
    return new $StringAttribute(update(this[$state], 'enum', nextEnum))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<
    CONSTANT extends ResolveStringAttribute<FreezeStringAttribute<$StringAttributeState<STATE>>>
  >(
    constant: CONSTANT
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        enum: [CONSTANT]
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
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        enum: [constant],
        defaults: ifThenElse(
          this[$state].key,
          {
            key: constant as unknown,
            put: this[$state].defaults.put,
            update: this[$state].defaults.update
          },
          {
            key: this[$state].defaults.key,
            put: constant as unknown,
            update: this[$state].defaults.update
          }
        )
      })
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  transform<
    TRANSFORMER extends Transformer<
      ResolvedStringAttribute,
      ResolveStringAttribute<FreezeStringAttribute<$StringAttributeState<STATE>>>
    >
  >(transform: TRANSFORMER): $StringAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $StringAttribute(overwrite(this[$state], { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        defaults: {
          key: unknown
          put: STATE['defaults']['put']
          update: STATE['defaults']['update']
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        defaults: {
          key: nextKeyDefault as unknown,
          put: this[$state].defaults.put,
          update: this[$state].defaults.update
        }
      })
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>>
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: unknown
          update: STATE['defaults']['update']
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: nextPutDefault as unknown,
          update: this[$state].defaults.update
        }
      })
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeStringAttribute<$StringAttributeState<STATE>>, true>
    >
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        defaults: {
          key: STATE['defaults']['key']
          put: STATE['defaults']['put']
          update: unknown
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        defaults: {
          key: this[$state].defaults.key,
          put: this[$state].defaults.put,
          update: nextUpdateDefault as unknown
        }
      })
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
        ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>
      >
    >
  ): $StringAttribute<
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
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        defaults: ifThenElse(
          this[$state].key,
          {
            key: nextDefault as unknown,
            put: this[$state].defaults.put,
            update: this[$state].defaults.update
          },
          {
            key: this[$state].defaults.key as unknown,
            put: nextDefault,
            update: this[$state].defaults.update
          }
        )
      })
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
    ) => ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        links: {
          key: unknown
          put: STATE['links']['put']
          update: STATE['links']['update']
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        links: {
          key: nextKeyLink as unknown,
          put: this[$state].links.put,
          update: this[$state].links.update
        }
      })
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
    ) => ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: unknown
          update: STATE['links']['update']
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: nextPutLink as unknown,
          update: this[$state].links.update
        }
      })
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
    ) => AttributeUpdateItemInput<FreezeStringAttribute<$StringAttributeState<STATE>>, true>
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        links: {
          key: STATE['links']['key']
          put: STATE['links']['put']
          update: unknown
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        links: {
          key: this[$state].links.key,
          put: this[$state].links.put,
          update: nextUpdateLink as unknown
        }
      })
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
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>
    >
  ): $StringAttribute<
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
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        links: ifThenElse(
          this[$state].key,
          {
            key: nextLink as unknown,
            put: this[$state].links.put,
            update: this[$state].links.update
          },
          {
            key: this[$state].links.key as unknown,
            put: nextLink,
            update: this[$state].links.update
          }
        )
      })
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
        FreezeStringAttribute<$StringAttributeState<STATE>>,
        { mode: 'key'; defined: true }
      >,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        validators: {
          key: Validator
          put: STATE['validators']['put']
          update: STATE['validators']['update']
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        validators: {
          key: nextKeyValidator as Validator,
          put: this[$state].validators.put,
          update: this[$state].validators.update
        }
      })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { defined: true }>,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        validators: {
          key: STATE['validators']['key']
          put: Validator
          update: STATE['validators']['update']
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        validators: {
          key: this[$state].validators.key,
          put: nextPutValidator as Validator,
          update: this[$state].validators.update
        }
      })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<FreezeStringAttribute<$StringAttributeState<STATE>>, true>,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<
    Overwrite<
      STATE,
      {
        validators: {
          key: STATE['validators']['key']
          put: STATE['validators']['put']
          update: Validator
        }
      }
    >
  > {
    return new $StringAttribute(
      overwrite(this[$state], {
        validators: {
          key: this[$state].validators.key,
          put: this[$state].validators.put,
          update: nextUpdateValidator as Validator
        }
      })
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
          FreezeStringAttribute<$StringAttributeState<STATE>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { defined: true }>
      >,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<
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
    >
  > {
    return new $StringAttribute(
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
      })
    )
  }

  freeze(path?: string): FreezeStringAttribute<$StringAttributeState<STATE>, true> {
    return freezeStringAttribute(this[$state], path)
  }
}

export class StringAttribute<STATE extends StringAttributeState = StringAttributeState>
  implements SharedAttributeState<STATE>
{
  type: 'string'
  path?: string
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  enum: STATE['enum']
  transform: STATE['transform']
  defaults: STATE['defaults']
  links: STATE['links']
  validators: STATE['validators']

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'string'
    this.path = path
    this.required = state.required
    this.hidden = state.hidden
    this.key = state.key
    this.savedAs = state.savedAs
    this.enum = state.enum
    this.transform = state.transform
    this.defaults = state.defaults
    this.links = state.links
    this.validators = state.validators
  }
}

export class StringAttribute_<
  STATE extends StringAttributeState = StringAttributeState
> extends StringAttribute<STATE> {
  clone<NEXT_STATE extends Partial<StringAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): StringAttribute<ConstrainedOverwrite<StringAttributeState, STATE, NEXT_STATE>> {
    return new StringAttribute({
      ...this,
      defaults: { ...this.defaults },
      links: { ...this.links },
      validators: { ...this.validators },
      ...nextState
    } as ConstrainedOverwrite<StringAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
