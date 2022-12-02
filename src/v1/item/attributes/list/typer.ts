import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, Never, AtLeastOnce } from '../constants'

import type { _ListAttributeElements } from './types'
import type { _ListAttribute } from './interface'
import { ListAttributeOptions, LIST_DEFAULT_OPTIONS } from './options'

type ListTyper = <
  Elements extends _ListAttributeElements,
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  _elements: Elements,
  options?: O.Partial<ListAttributeOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
) => _ListAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, Default>

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
  Elements extends _ListAttributeElements,
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  elements: Elements,
  options?: O.Partial<ListAttributeOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
): _ListAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, Default> => {
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
    required: <NextIsRequired extends RequiredOption = AtLeastOnce>(
      nextRequired: NextIsRequired = 'atLeastOnce' as NextIsRequired
    ) => list(elements, { ...appliedOptions, required: nextRequired }),
    hidden: () => list(elements, { ...appliedOptions, hidden: true }),
    key: () => list(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => list(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(elements, { ...appliedOptions, default: nextDefault })
  } as _ListAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, Default>
}
