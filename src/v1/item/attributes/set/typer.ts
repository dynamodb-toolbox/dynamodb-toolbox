import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'
import { ComputedDefault } from '../constants'

import type { _SetAttribute } from './interface'
import { SetAttributeOptions, SET_ATTRIBUTE_DEFAULT_OPTIONS } from './options'
import type { _SetAttributeElements } from './types'

type SetTyper = <
  ELEMENTS extends _SetAttributeElements,
  IS_REQUIRED extends RequiredOption = Never,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ComputedDefault | undefined = undefined
>(
  _elements: ELEMENTS,
  options?: O.Partial<SetAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>>
) => _SetAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>

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
  ELEMENTS extends _SetAttributeElements,
  IS_REQUIRED extends RequiredOption = Never,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ComputedDefault | undefined = undefined
>(
  elements: ELEMENTS,
  options?: O.Partial<SetAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>>
): _SetAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT> => {
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
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => set(elements, { ...appliedOptions, required: nextRequired }),
    hidden: () => set(elements, { ...appliedOptions, hidden: true }),
    key: () => set(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => set(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => set(elements, { ...appliedOptions, default: nextDefault })
  } as _SetAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
}
