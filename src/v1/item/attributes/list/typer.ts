import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

import type { _ListAttributeElements } from './types'
import type { _ListAttribute } from './interface'
import { ListAttributeOptions, LIST_DEFAULT_OPTIONS } from './options'

type ListTyper = <
  ELEMENTS extends _ListAttributeElements,
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ComputedDefault | undefined = undefined
>(
  _elements: ELEMENTS,
  options?: O.Partial<ListAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>>
) => _ListAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>

/**
 * Define a new list attribute
 * Not that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Doesn't have a default value (default: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const list: ListTyper = <
  ELEMENTS extends _ListAttributeElements,
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ComputedDefault | undefined = undefined
>(
  elements: ELEMENTS,
  options?: O.Partial<ListAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>>
): _ListAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT> => {
  const appliedOptions = { ...LIST_DEFAULT_OPTIONS, ...options }
  const {
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'list',
    _elements: elements,
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => list(elements, { ...appliedOptions, required: nextRequired }),
    optional: () => list(elements, { ...appliedOptions, required: 'never' }),
    hidden: () => list(elements, { ...appliedOptions, hidden: true }),
    key: () => list(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => list(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(elements, { ...appliedOptions, default: nextDefault })
  } as _ListAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
}
