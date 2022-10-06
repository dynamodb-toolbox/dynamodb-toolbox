import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'
import { ComputedDefault } from '../constants'

import type { SetAttribute } from './interface'
import { SetAttributeOptions, SET_ATTRIBUTE_DEFAULT_OPTIONS } from './options'
import type { SetAttributeElements } from './types'

type SetTyper = <
  Elements extends SetAttributeElements,
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  _elements: Elements,
  options?: O.Partial<SetAttributeOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
) => SetAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, Default>

/**
 * Define a new set attribute
 * Not that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Doesn't have a default value (default: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const set: SetTyper = <
  Elements extends SetAttributeElements,
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  elements: Elements,
  options?: O.Partial<SetAttributeOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
): SetAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, Default> => {
  const appliedOptions = { ...SET_ATTRIBUTE_DEFAULT_OPTIONS, ...options }
  const {
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'set',
    _elements: elements,
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    required: <NextIsRequired extends RequiredOption = AtLeastOnce>(
      nextRequired: NextIsRequired = 'atLeastOnce' as NextIsRequired
    ) => set(elements, { ...appliedOptions, required: nextRequired }),
    hidden: () => set(elements, { ...appliedOptions, hidden: true }),
    key: () => set(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => set(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => set(elements, { ...appliedOptions, default: nextDefault })
  } as SetAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, Default>
}
