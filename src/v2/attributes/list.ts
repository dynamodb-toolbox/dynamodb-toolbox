import { O } from 'ts-toolbelt'

import { Property } from './property'
import { ComputedDefault } from './utility'

type RequiredDisplayedProperty = Property & {
  _required: true
  _hidden: false
}

interface _ListOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _default: D
}

export interface List<
  E extends RequiredDisplayedProperty = RequiredDisplayedProperty,
  R extends boolean = boolean,
  H extends boolean = boolean,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _ListOptions<R, H, D> {
  _type: 'list'
  _elements: E
  _default: D
  required: () => List<E, true, H, D>
  hidden: () => List<E, R, true, D>
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => List<E, R, H, $D>
}

interface ListOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  default: D
}

const listDefaultOptions: ListOptions<false, false, undefined> = {
  required: false,
  hidden: false,
  default: undefined
}

type ListTyper = <
  E extends RequiredDisplayedProperty,
  R extends boolean = false,
  H extends boolean = false,
  D extends ComputedDefault | undefined = undefined
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H, D>>
) => List<E, R, H, D>

export const list: ListTyper = <
  E extends RequiredDisplayedProperty,
  R extends boolean = false,
  H extends boolean = false,
  D extends ComputedDefault | undefined = undefined
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H, D>>
): List<E, R, H, D> => {
  const { _required: _elRequired, _hidden: _elHidden } = _elements

  if (_elRequired !== true) {
    // TODO: display path in error OR override _elRequired to true
    throw new Error('List elements must be required')
  }

  if (_elHidden !== false) {
    // TODO: display path in error OR override _elHidden to false
    throw new Error('List elements cannot be hidden')
  }

  const appliedOptions = { ...listDefaultOptions, ...options }
  const { required: _required, hidden: _hidden, default: _default } = appliedOptions

  return {
    _type: 'list',
    _elements,
    _required,
    _hidden,
    _default,
    required: () => list(_elements, { ...appliedOptions, required: true }),
    hidden: () => list(_elements, { ...appliedOptions, hidden: true }),
    default: nextDefault => list(_elements, { ...appliedOptions, default: nextDefault })
  } as List<E, R, H, D>
}
