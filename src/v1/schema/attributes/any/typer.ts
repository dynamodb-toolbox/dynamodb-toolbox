import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import { $type, $required, $hidden, $key, $savedAs, $defaults } from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { $AnyAttribute } from './interface'
import { AnyAttributeOptions, AnyAttributeDefaultOptions, ANY_DEFAULT_OPTIONS } from './options'

type AnyAttributeTyper = <OPTIONS extends Partial<AnyAttributeOptions> = AnyAttributeOptions>(
  options?: NarrowObject<OPTIONS>
) => $AnyAttribute<InferStateFromOptions<AnyAttributeOptions, AnyAttributeDefaultOptions, OPTIONS>>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Boolean Options
 */
export const any: AnyAttributeTyper = <
  OPTIONS extends Partial<AnyAttributeOptions> = AnyAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = {
    ...ANY_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...ANY_DEFAULT_OPTIONS.defaults, ...options?.defaults }
  }

  return {
    [$type]: 'any',
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$defaults]: appliedOptions.defaults,
    required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_REQUIRED = ('atLeastOnce' as unknown) as NEXT_REQUIRED
    ) => any({ ...appliedOptions, required: nextRequired }),
    optional: () => any({ ...appliedOptions, required: 'never' }),
    hidden: () => any({ ...appliedOptions, hidden: true }),
    key: () => any({ ...appliedOptions, key: true, required: 'always' }),
    savedAs: nextSavedAs => any({ ...appliedOptions, savedAs: nextSavedAs }),
    keyDefault: nextKeyDefault =>
      any({ ...appliedOptions, defaults: { ...appliedOptions.defaults, key: nextKeyDefault } }),
    putDefault: nextPutDefault =>
      any({ ...appliedOptions, defaults: { ...appliedOptions.defaults, put: nextPutDefault } }),
    updateDefault: nextUpdateDefault =>
      any({
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, update: nextUpdateDefault }
      }),
    default: nextDefault =>
      any({
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, [appliedOptions.key ? 'key' : 'put']: nextDefault }
      })
  } as $AnyAttribute<
    InferStateFromOptions<AnyAttributeOptions, AnyAttributeDefaultOptions, OPTIONS>
  >
}
