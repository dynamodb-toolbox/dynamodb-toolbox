import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type { _MapAttributeAttributes, Narrow } from '../types'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $open,
  $savedAs,
  $default
} from '../constants/symbols'

import type { _MapAttribute } from './interface'
import { MapAttributeOptions, MAPPED_DEFAULT_OPTIONS } from './options'

type MapAttributeAttributeTyper = <
  ATTRIBUTES extends _MapAttributeAttributes = {},
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  IS_OPEN extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ComputedDefault | undefined = undefined
>(
  attributes: Narrow<ATTRIBUTES>,
  options?: O.Partial<
    MapAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
  >
) => _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param options _(optional)_ Map Options
 */
export const map: MapAttributeAttributeTyper = <
  ATTRIBUTES extends _MapAttributeAttributes = {},
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  IS_OPEN extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ComputedDefault | undefined = undefined
>(
  attributes: Narrow<ATTRIBUTES>,
  options?: O.Partial<
    MapAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
  >
): _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT> => {
  const appliedOptions = { ...MAPPED_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'map',
    [$attributes]: attributes,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$open]: appliedOptions.open,
    [$savedAs]: appliedOptions.savedAs,
    [$default]: appliedOptions.default,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = ('atLeastOnce' as unknown) as NEXT_IS_REQUIRED
    ) => map(attributes, { ...appliedOptions, required: nextRequired }),
    optional: () => map(attributes, { ...appliedOptions, required: 'never' }),
    hidden: () => map(attributes, { ...appliedOptions, hidden: true }),
    key: () => map(attributes, { ...appliedOptions, key: true }),
    open: () => map(attributes, { ...appliedOptions, open: true }),
    savedAs: nextSavedAs => map(attributes, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(attributes, { ...appliedOptions, default: nextDefault })
  } as _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
}
