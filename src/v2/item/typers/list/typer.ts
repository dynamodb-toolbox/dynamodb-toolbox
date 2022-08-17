import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, Never, AtLeastOnce } from '../constants'

import type { ListProperty } from './types'
import type { List } from './interface'
import { ListOptions, listDefaultOptions } from './options'

type ListTyper = <
  E extends ListProperty,
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H, K, S, D>>
) => List<E, R, H, K, S, D>

/**
 * Define a new list property
 * Not that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Non-key (key: false)
 * - Not renamed (savedAs: undefined)
 * - Non default (default: undefined)
 *
 * @param elements Property (With constraints)
 * @param options _(optional)_ List Options
 */
export const list: ListTyper = <
  E extends ListProperty,
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  elements: E,
  options?: O.Partial<ListOptions<R, H, K, S, D>>
): List<E, R, H, K, S, D> => {
  const appliedOptions = { ...listDefaultOptions, ...options }
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
    required: <$R extends RequiredOption = AtLeastOnce>(nextRequired: $R = AtLeastOnce as $R) =>
      list(elements, { ...appliedOptions, required: nextRequired }),
    hidden: () => list(elements, { ...appliedOptions, hidden: true }),
    key: () => list(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => list(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(elements, { ...appliedOptions, default: nextDefault })
  } as List<E, R, H, K, S, D>
}
