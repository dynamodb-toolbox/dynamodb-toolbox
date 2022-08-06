import { O } from 'ts-toolbelt'

import { Property } from './property'
import { ComputedDefault } from './utility'

type ListProperty = Property & {
  _required: true
  _hidden: false
  _savedAs: undefined
  _default: undefined
}

interface _ListOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _savedAs: S
  _default: D
}

export interface List<
  E extends ListProperty = ListProperty,
  R extends boolean = boolean,
  H extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _ListOptions<R, H, S, D> {
  _type: 'list'
  _elements: E
  required: () => List<E, true, H, S, D>
  hidden: () => List<E, R, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => List<E, R, H, $S, D>
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => List<E, R, H, S, $D>
}

interface ListOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  savedAs: S
  default: D
}

const listDefaultOptions: ListOptions<false, false, undefined, undefined> = {
  required: false,
  hidden: false,
  savedAs: undefined,
  default: undefined
}

type ListTyper = <
  E extends ListProperty,
  R extends boolean = false,
  H extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H, S, D>>
) => List<E, R, H, S, D>

export const list: ListTyper = <
  E extends ListProperty,
  R extends boolean = false,
  H extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H, S, D>>
): List<E, R, H, S, D> => {
  const {
    _required: _elRequired,
    _hidden: _elHidden,
    _savedAs: _elSavedAs,
    _default: _elDefault
  } = _elements

  if (_elRequired !== true) {
    // TODO: display path in error OR override _elRequired to true
    throw new Error('List elements must be required')
  }

  if (_elHidden !== false) {
    // TODO: display path in error OR override _elHidden to false
    throw new Error('List elements cannot be hidden')
  }

  if (_elSavedAs !== undefined) {
    // TODO: display path in error OR override _elHidden to false
    throw new Error('List elements cannot be renamed (have savedAs option)')
  }

  if (_elDefault !== undefined) {
    // TODO: display path in error OR override _elHidden to false
    throw new Error('List elements cannot have default values')
  }

  const appliedOptions = { ...listDefaultOptions, ...options }
  const {
    required: _required,
    hidden: _hidden,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'list',
    _elements,
    _required,
    _hidden,
    _savedAs,
    _default,
    required: () => list(_elements, { ...appliedOptions, required: true }),
    hidden: () => list(_elements, { ...appliedOptions, hidden: true }),
    savedAs: nextSavedAs => list(_elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(_elements, { ...appliedOptions, default: nextDefault })
  } as List<E, R, H, S, D>
}
