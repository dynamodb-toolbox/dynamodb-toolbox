import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { AnyAttributeDefaultValue } from './types'
import type { AnyAttribute } from './interface'
import { AnyAttributeOptions, ANY_DEFAULT_OPTIONS } from './options'

type AnyAttributeTyper = <
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends AnyAttributeDefaultValue = undefined
>(
  options?: O.Partial<AnyAttributeOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
) => AnyAttribute<IsRequired, IsHidden, IsKey, SavedAs, Default>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Boolean Options
 */
export const any: AnyAttributeTyper = <
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends AnyAttributeDefaultValue = undefined
>(
  options?: O.Partial<AnyAttributeOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
): AnyAttribute<IsRequired, IsHidden, IsKey, SavedAs, Default> => {
  const appliedOptions = { ...ANY_DEFAULT_OPTIONS, ...options }
  const {
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'any',
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    required: <NextRequired extends RequiredOption = AtLeastOnce>(
      nextRequired: NextRequired = ('atLeastOnce' as unknown) as NextRequired
    ) => any({ ...appliedOptions, required: nextRequired }),
    hidden: () => any({ ...appliedOptions, hidden: true }),
    key: () => any({ ...appliedOptions, key: true }),
    savedAs: nextSavedAs => any({ ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => any({ ...appliedOptions, default: nextDefault })
  } as AnyAttribute<IsRequired, IsHidden, IsKey, SavedAs, Default>
}
