import { O } from 'ts-toolbelt'
import { ComputedDefault } from './utility'

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
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _default: D
}

export type Leaf<
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> = {
  _type: T
  _resolved?: ResolveLeafType<T>
  required: () => Leaf<T, true, H, K, S, D>
  hidden: () => Leaf<T, R, true, K, S, D>
  key: () => Leaf<T, R, H, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Leaf<T, R, H, K, $S, D>
  default: <$D extends LeafDefaultValue<T>>(nextDefaultValue: $D) => Leaf<T, R, H, K, S, $D>
} & _LeafOptions<T, R, H, K, S, D>

interface LeafOptions<
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  default: D
}

const leafDefaultOptions: LeafOptions<LeafType, false, false, false, undefined, undefined> = {
  required: false,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}

const leaf = <
  T extends LeafType = LeafType,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
>(
  options: { type: T } & LeafOptions<T, R, H, K, S, D>
): Leaf<T, R, H, K, S, D> => {
  const {
    type: _type,
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default
  } = options

  return {
    _type,
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    required: () => leaf({ ...options, required: true }),
    hidden: () => leaf({ ...options, hidden: true }),
    key: () => leaf({ ...options, key: true }),
    savedAs: nextSavedAs => leaf({ ...options, savedAs: nextSavedAs }),
    default: nextDefault => leaf({ ...options, default: nextDefault })
  }
}

type LeafTyper<T extends LeafType> = <
  R extends boolean = false,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  D extends LeafDefaultValue<T> = undefined
>(
  options?: O.Partial<LeafOptions<T, R, H, K, S, D>>
) => Leaf<T, R, H, K, S, D>

const getLeafTyper = <T extends LeafType>(type: T) =>
  (<
    R extends boolean = false,
    H extends boolean = false,
    K extends boolean = false,
    S extends string | undefined = undefined,
    D extends LeafDefaultValue<T> = undefined
  >(
    leafOptions?: O.Partial<LeafOptions<T, R, H, K, S, D>>
  ) => leaf({ ...leafDefaultOptions, ...leafOptions, type })) as LeafTyper<T>

export const string = getLeafTyper('string')
export const number = getLeafTyper('number')
export const binary = getLeafTyper('binary')
export const boolean = getLeafTyper('boolean')
