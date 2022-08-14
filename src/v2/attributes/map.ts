import { O } from 'ts-toolbelt'

import { RequiredOption, Never, AtLeastOnce } from './requiredOptions'
import { MappedProperties } from './property'
import { ComputedDefault, Narrow, validateProperty } from './utility'

// TODO: Add false saveAs option
interface _MappedOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _key: K
  _open: O
  _savedAs: S
  _default: D
}

export interface Mapped<
  P extends MappedProperties = MappedProperties,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _MappedOptions<R, H, K, O, S, D> {
  _type: 'map'
  _properties: P
  required: <$R extends RequiredOption = AtLeastOnce>(
    nextRequired?: $R
  ) => Mapped<P, $R, H, K, O, S, D>
  hidden: () => Mapped<P, R, true, K, O, S, D>
  key: () => Mapped<P, R, H, true, O, S, D>
  open: () => Mapped<P, R, H, K, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Mapped<P, R, H, K, O, $S, D>
  default: <$D extends ComputedDefault | undefined>(
    nextDefaultValue: $D
  ) => Mapped<P, R, H, K, O, S, $D>
}

interface MappedOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  key: K
  open: O
  savedAs: S
  default: D
}

const mappedDefaultOptions: MappedOptions<Never, false, false, false, undefined, undefined> = {
  required: Never,
  hidden: false,
  key: false,
  open: false,
  savedAs: undefined,
  default: undefined
}

type MappedTyper = <
  P extends MappedProperties = {},
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  O extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, K, O, S, D>>
) => Mapped<P, R, H, K, O, S, D>

export const map: MappedTyper = <
  P extends MappedProperties = {},
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  O extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, K, O, S, D>>
): Mapped<P, R, H, K, O, S, D> => {
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
    _properties,
    _required,
    _hidden,
    _key,
    _open,
    _savedAs,
    _default,
    required: <$R extends RequiredOption = AtLeastOnce>(
      nextRequired: $R = AtLeastOnce as unknown as $R
    ) => map(_properties, { ...appliedOptions, required: nextRequired }),
    hidden: () => map(_properties, { ...appliedOptions, hidden: true }),
    key: () => map(_properties, { ...appliedOptions, key: true }),
    open: () => map(_properties, { ...appliedOptions, open: true }),
    savedAs: nextSavedAs => map(_properties, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(_properties, { ...appliedOptions, default: nextDefault })
  } as Mapped<P, R, H, K, O, S, D>
}

export const validateMap = <M extends Mapped>(mapped: M, path?: string): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)

  const { _properties: properties } = mapped

  return Object.entries(properties).every(([propertyName, property]) =>
    validateProperty(property, [path, propertyName].filter(Boolean).join('.'))
  )
}
