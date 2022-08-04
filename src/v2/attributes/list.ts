import { O } from 'ts-toolbelt'

import { Property } from './property'

type RequiredDisplayedProperty = Property & {
  _required: true
  _hidden: false
}

interface _ListOptions<R extends boolean = boolean, H extends boolean = boolean> {
  _required: R
  _hidden: H
  // May be handled later
  _default: undefined
}

export interface List<
  E extends RequiredDisplayedProperty = RequiredDisplayedProperty,
  R extends boolean = boolean,
  H extends boolean = boolean
> extends _ListOptions<R, H> {
  _type: 'list'
  _elements: E
  required: () => List<E, true, H>
  hidden: () => List<E, R, true>
}

interface ListOptions<R extends boolean = boolean, H extends boolean = boolean> {
  required: R
  hidden: H
  // May be handled later
  default: undefined
}

const listDefaultOptions: ListOptions<false, false> = {
  required: false,
  hidden: false,
  default: undefined
}

type ListTyper = <
  E extends RequiredDisplayedProperty,
  R extends boolean = false,
  H extends boolean = false
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H>>
) => List<E, R, H>

export const list: ListTyper = <
  E extends RequiredDisplayedProperty,
  R extends boolean = false,
  H extends boolean = false
>(
  _elements: E,
  options?: O.Partial<ListOptions<R, H>>
): List<E, R, H> => {
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
  const { required: _required, hidden: _hidden } = appliedOptions

  return {
    _type: 'list',
    _elements,
    _required,
    _hidden,
    required: () => list(_elements, { ...appliedOptions, required: true }),
    hidden: () => list(_elements, { ...appliedOptions, hidden: true })
  } as List<E, R, H>
}
