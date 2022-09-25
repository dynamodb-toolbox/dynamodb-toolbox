import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, Never, AtLeastOnce } from '../constants'
import type { MappedAttributes, Narrow } from '../types'

import type { Mapped } from './interface'
import { MappedOptions, mappedDefaultOptions } from './options'

type MappedTyper = <
  Attributes extends MappedAttributes = {},
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  IsOpen extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  _attributes: Narrow<Attributes>,
  options?: O.Partial<MappedOptions<IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>>
) => Mapped<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param options _(optional)_ Map Options
 */
export const map: MappedTyper = <
  Attributes extends MappedAttributes = {},
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  IsOpen extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  attributes: Narrow<Attributes>,
  options?: O.Partial<MappedOptions<IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>>
): Mapped<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default> => {
  const appliedOptions = { ...mappedDefaultOptions, ...options }
  const {
    required: _required,
    hidden: _hidden,
    key: _key,
    open: _open,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'map',
    _attributes: attributes,
    _required,
    _hidden,
    _key,
    _open,
    _savedAs,
    _default,
    required: <NextIsRequired extends RequiredOption = AtLeastOnce>(
      nextRequired: NextIsRequired = ('atLeastOnce' as unknown) as NextIsRequired
    ) => map(attributes, { ...appliedOptions, required: nextRequired }),
    hidden: () => map(attributes, { ...appliedOptions, hidden: true }),
    key: () => map(attributes, { ...appliedOptions, key: true }),
    open: () => map(attributes, { ...appliedOptions, open: true }),
    savedAs: nextSavedAs => map(attributes, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(attributes, { ...appliedOptions, default: nextDefault })
  } as Mapped<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>
}
