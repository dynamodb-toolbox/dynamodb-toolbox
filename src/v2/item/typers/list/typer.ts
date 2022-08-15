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

export const list: ListTyper = <
  E extends ListProperty,
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _elements: E,
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
    _elements,
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    required: <$R extends RequiredOption = AtLeastOnce>(nextRequired: $R = AtLeastOnce as $R) =>
      list(_elements, { ...appliedOptions, required: nextRequired }),
    hidden: () => list(_elements, { ...appliedOptions, hidden: true }),
    key: () => list(_elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => list(_elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(_elements, { ...appliedOptions, default: nextDefault })
  } as List<E, R, H, K, S, D>
}
