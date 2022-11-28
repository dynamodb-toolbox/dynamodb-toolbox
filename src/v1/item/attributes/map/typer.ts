import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, Never, AtLeastOnce } from '../constants'
import type { MapAttributeAttributes, Narrow } from '../types'

import type { _MapAttribute } from './interface'
import { MapAttributeOptions, MAPPED_DEFAULT_OPTIONS } from './options'

type MapAttributeAttributeTyper = <
  Attributes extends MapAttributeAttributes = {},
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  IsOpen extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  _attributes: Narrow<Attributes>,
  options?: O.Partial<MapAttributeOptions<IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>>
) => _MapAttribute<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param options _(optional)_ Map Options
 */
export const map: MapAttributeAttributeTyper = <
  Attributes extends MapAttributeAttributes = {},
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  IsOpen extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends ComputedDefault | undefined = undefined
>(
  attributes: Narrow<Attributes>,
  options?: O.Partial<MapAttributeOptions<IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>>
): _MapAttribute<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default> => {
  const appliedOptions = { ...MAPPED_DEFAULT_OPTIONS, ...options }
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
  } as _MapAttribute<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>
}
