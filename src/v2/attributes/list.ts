import { O } from 'ts-toolbelt'

import { Property } from './property'
import { ComputedDefault, errorMessagePathSuffix, validateProperty } from './utility'

type ListProperty = Property & {
  _required: true
  _hidden: false
  _key: false
  _savedAs: undefined
  _default: undefined
}

interface _ListOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _default: D
}

export interface List<
  E extends ListProperty = ListProperty,
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _ListOptions<R, H, K, S, D> {
  _type: 'list'
  _elements: E
  required: () => List<E, true, H, K, S, D>
  hidden: () => List<E, R, true, K, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => List<E, R, H, K, $S, D>
  key: () => List<E, R, H, true, S, D>
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => List<E, R, H, K, S, $D>
}

interface ListOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  default: D
}

const listDefaultOptions: ListOptions<false, false, false, undefined, undefined> = {
  required: false,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}

type ListTyper = <
  E extends ListProperty,
  R extends boolean = false,
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
  R extends boolean = false,
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
    required: () => list(_elements, { ...appliedOptions, required: true }),
    hidden: () => list(_elements, { ...appliedOptions, hidden: true }),
    key: () => list(_elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => list(_elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(_elements, { ...appliedOptions, default: nextDefault })
  } as List<E, R, H, K, S, D>
}

export class OptionalListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${errorMessagePathSuffix(path)}: List elements must be required`)
  }
}

export class HiddenListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${errorMessagePathSuffix(path)}: List elements cannot be hidden`)
  }
}

export class KeyListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${errorMessagePathSuffix(path)}: List elements cannot be part of key`
    )
  }
}

export class SavedAsListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${errorMessagePathSuffix(
        path
      )}: List elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${errorMessagePathSuffix(
        path
      )}: List elements cannot have default values`
    )
  }
}

export const validateList = <L extends List>(
  { _elements: elements }: L,
  path?: string
): boolean => {
  const {
    _required: elementsRequired,
    _hidden: elementsHidden,
    _key: elementsKey,
    _savedAs: elementsSavedAs,
    _default: elementsDefault
  } = elements

  if (elementsRequired !== true) {
    throw new OptionalListElementsError({ path })
  }

  if (elementsHidden !== false) {
    throw new HiddenListElementsError({ path })
  }

  if (elementsKey !== false) {
    throw new KeyListElementsError({ path })
  }

  if (elementsSavedAs !== undefined) {
    throw new SavedAsListElementsError({ path })
  }

  if (elementsDefault !== undefined) {
    throw new DefaultedListElementsError({ path })
  }

  return validateProperty(elements, `${path ?? ''}[n]`)
}
