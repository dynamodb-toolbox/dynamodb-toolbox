import { O } from 'ts-toolbelt'

import { ComputedDefault, errorMessagePathSuffix } from './utility'

type LeafType = 'string' | 'boolean' | 'number' | 'binary'

export type ResolveLeafType<T extends LeafType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'binary'
  ? Buffer
  : never

type EnumValues<T extends LeafType> = ResolveLeafType<T>[] | undefined

type LeafDefaultValue<T extends LeafType> =
  | undefined
  | ComputedDefault
  | ResolveLeafType<T>
  | (() => ResolveLeafType<T>)

interface _LeafOptions<
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _enum: E
  _default: D
}

export type Leaf<
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> = {
  _type: T
  _resolved?: E extends ResolveLeafType<T>[] ? E[number] : ResolveLeafType<T>
  required: () => Leaf<T, true, H, K, S, E, D>
  hidden: () => Leaf<T, R, true, K, S, E, D>
  key: () => Leaf<T, R, H, true, S, E, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Leaf<T, R, H, K, $S, E, D>
  enum: <$E extends ResolveLeafType<T>[]>(...nextEnum: $E) => Leaf<T, R, H, K, S, $E, D & $E>
  default: <
    $D extends LeafDefaultValue<T> &
      (E extends ResolveLeafType<T>[] ? E[number] | (() => E[number]) : unknown)
  >(
    nextDefaultValue: $D
  ) => Leaf<T, R, H, K, S, E, $D>
} & _LeafOptions<T, R, H, K, S, E, D>

interface LeafOptions<
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  _enum: E
  default: D
}

const leafDefaultOptions: LeafOptions<
  LeafType,
  false,
  false,
  false,
  undefined,
  undefined,
  undefined
> = {
  required: false,
  hidden: false,
  key: false,
  savedAs: undefined,
  _enum: undefined,
  default: undefined
}

const leaf = <
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
>(
  options: { type: T } & LeafOptions<T, R, H, K, S, E, D>
): Leaf<T, R, H, K, S, E, D> => {
  const {
    type: _type,
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default,
    _enum
  } = options

  return {
    _type,
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    _enum,
    required: () => leaf({ ...options, required: true }),
    hidden: () => leaf({ ...options, hidden: true }),
    key: () => leaf({ ...options, key: true }),
    savedAs: nextSavedAs => leaf({ ...options, savedAs: nextSavedAs }),
    default: nextDefault => leaf({ ...options, default: nextDefault }),
    enum: (...nextEnum) => leaf({ ...options, _enum: nextEnum })
  } as Leaf<T, R, H, K, S, E, D>
}

type LeafTyper<T extends LeafType> = <
  R extends boolean = false,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  E extends EnumValues<T> = undefined,
  D extends LeafDefaultValue<T> = undefined
>(
  options?: O.Partial<LeafOptions<T, R, H, K, S, E, D>>
) => Leaf<T, R, H, K, S, E, D>

const getLeafTyper = <T extends LeafType>(type: T) =>
  (<
    R extends boolean = false,
    H extends boolean = false,
    K extends boolean = false,
    S extends string | undefined = undefined,
    D extends LeafDefaultValue<T> = undefined,
    E extends EnumValues<T> = undefined
  >(
    leafOptions?: O.Partial<LeafOptions<T, R, H, K, S, E, D>>
  ) => leaf({ ...leafDefaultOptions, ...leafOptions, type })) as LeafTyper<T>

export const string = getLeafTyper('string')
export const number = getLeafTyper('number')
export const binary = getLeafTyper('binary')
export const boolean = getLeafTyper('boolean')

export class InvalidEnumValueTypeError extends Error {
  constructor({
    expectedType,
    enumValue,
    path
  }: {
    expectedType: LeafType
    enumValue: NonNullable<EnumValues<LeafType>>[number]
    path?: string
  }) {
    super(
      `Invalid enum value type${errorMessagePathSuffix(
        path
      )}. Expected: ${expectedType}. Received: ${String(enumValue)}.`
    )
  }
}

export class InvalidDefaultValueTypeError extends Error {
  constructor({
    expectedType,
    defaultValue,
    path
  }: {
    expectedType: LeafType
    defaultValue: NonNullable<LeafDefaultValue<LeafType>>
    path?: string
  }) {
    super(
      `Invalid default value type${errorMessagePathSuffix(
        path
      )}: Expected: ${expectedType}. Received: ${String(defaultValue)}.`
    )
  }
}

export class InvalidDefaultValueRangeError extends Error {
  constructor({
    enumValues,
    defaultValue,
    path
  }: {
    enumValues: NonNullable<EnumValues<LeafType>>
    defaultValue: NonNullable<LeafDefaultValue<LeafType>>
    path?: string
  }) {
    super(
      `Invalid default value${errorMessagePathSuffix(path)}: Expected one of: ${enumValues.join(
        ', '
      )}. Received: ${String(defaultValue)}.`
    )
  }
}

export const validateLeaf = <L extends Leaf>(
  { _type: expectedType, _enum: enumValues, _default: defaultValue }: L,
  path?: string
): boolean => {
  enumValues?.forEach(enumValue => {
    if (typeof enumValue !== expectedType) {
      throw new InvalidEnumValueTypeError({ expectedType, enumValue, path })
    }
  })

  if (
    defaultValue !== undefined &&
    defaultValue !== ComputedDefault &&
    typeof defaultValue !== 'function'
  ) {
    if (typeof defaultValue !== expectedType) {
      throw new InvalidDefaultValueTypeError({ expectedType, defaultValue, path })
    }

    if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
      throw new InvalidDefaultValueRangeError({ enumValues, defaultValue, path })
    }
  }

  return true
}
